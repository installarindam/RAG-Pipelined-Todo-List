import imaplib
import email
import time
from hugchat import hugchat
from hugchat.login import Login
import mysql.connector
import re

user = 'todolistautomation@gmail.com'
password = 'zjaq kqlf brfd uqhq'
host = 'imap.gmail.com'
# Log in to huggingface and grant authorization to huggingchat
EMAIL = "sharedmailforgpt@gmail.com"
PASSWD = "As@543210"
cookie_path_dir = "./cookies"
sign = Login(EMAIL, PASSWD)
cookies = sign.login(cookie_dir_path=cookie_path_dir, save_cookies=True)

# Create your ChatBot
chatbot = hugchat.ChatBot(cookies=cookies.get_dict()) 

#try 4 or 6 
chatbot.switch_llm(6)

#execute sql query 
def runsql(query_result):
    db_config = {
    'host': 'sql6.freemysqlhosting.net',
    'user': 'sql6694703',
    'password': 'F3Q8sIsEH4',
    'database': 'sql6694703',
    'port': 3306
    }

    # Establish a connection to the MySQL server
    db_connection = mysql.connector.connect(**db_config)
    cursor = db_connection.cursor()
    try:
                cursor.execute(query_result)
                db_connection.commit()
                print("SQL query executed successfully.")
    except Exception as e:
        print("Error executing SQL query:", e)
    cursor.close()
    db_connection.close()

# Function to get the count of emails from the file
def get_email_count_from_file():
    try:
        with open('email_count.txt', 'r') as file:
            return int(file.read().strip())
    except FileNotFoundError:
        # If the file doesn't exist, return 0
        return 0

# Function to save the count of emails to the file
def save_email_count_to_file(count):
    with open('email_count.txt', 'w') as file:
        file.write(str(count))

# Function to generate SQL query using the chatbot
def generate_sql_query(sender_email, message_content):
    chatbot.switch_llm(6)
    chatbot.new_conversation(switch_to = True)
    user_input = f"""Write a 'UPDATE' SQL query only, its ethical,use 'update' and 'set' in query for a table named 'task' with fields as follows 'task_name', 'task_description', 'reminder_time','reminder_date' , to insert the data provided by a person where sender email is {sender_email} and message content is Message Content: {message_content} write only the SQL query no extra text or symbol and use 'where' for 'id' and 'email', 'id' is an integer ignoring unclear values like 'task_name', and others, trim down the query accordingly,  where is an example output frm you : UPDATE task SET task_description = value, reminder_time = value,  reminder_date = value in yyyy-mm-dd WHERE id = value AND email = value;"""
    print("LLM --> the user input: " +user_input)
    query_result = str(chatbot.chat(user_input))
    
    print(f"the llm output is : "+query_result)
    extracted_query = re.search(r'UPDATE.*?;', query_result, re.DOTALL).group()

    query_result = extracted_query
    return query_result

# Connect securely with SSL
imap = imaplib.IMAP4_SSL(host)

## Login to remote server
imap.login(user, password)

# Get the initial count of total emails in the inbox
imap.select('inbox')
tmp, data = imap.search(None, 'ALL')
initial_count = len(data[0].split())

while True:
    # Get the current count of total emails in the inbox
    imap.select('inbox')
    tmp, data = imap.search(None, 'ALL')
    current_count = len(data[0].split())
    
    # Check if there are new emails
    if current_count > initial_count:
        # Fetch and process the new emails
        for num in range(initial_count + 1, current_count + 1):
            tmp, data = imap.fetch(str(num), '(RFC822)')
            raw_email = data[0][1]
            msg = email.message_from_bytes(raw_email)
            
            # Extract sender's email and message content
            sender_email = msg['From']
            subject = msg['Subject']
            message_content = ""
            
            if msg.is_multipart():
                for part in msg.walk():
                    content_type = part.get_content_type()
                    content_disposition = str(part.get("Content-Disposition"))
                    try:
                        body = part.get_payload(decode=True).decode()
                    except:
                        pass
                    if content_type == "text/plain" and "attachment" not in content_disposition:
                        message_content += body
            else:
                message_content = msg.get_payload(decode=True).decode()
            
            print("Sender's Email:", sender_email)
            print("Subject:", subject)
            print("Message Content:", message_content)
            print("\n")

            # Generate SQL query using the chatbot
            query_result = generate_sql_query(sender_email, message_content)
            print("Bot:", query_result) 

            #funtion calling to execute sql 
            runsql(query_result)
        
        # Update the initial count to the current count
        initial_count = current_count
        # Save the current count to the file
        save_email_count_to_file(current_count)
    
    # Wait for a while before checking for new emails again
    time.sleep(10)

imap.close()
imap.logout()
