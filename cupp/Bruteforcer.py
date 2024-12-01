#!/usr/bin/python3

import argparse
import sys
import time
from termcolor import colored

PASSWORD="Anasbliss"

def bruteforce_demo(url, wordlist, target_password):
    """
    Demonstrate a basic brute force password guessing mechanism
    """
    try:
        with open(wordlist, 'r', encoding='latin-1') as file:
            passwords = file.read().splitlines()
    except FileNotFoundError:
        print(colored(f"Error: Wordlist file '{wordlist}' not found.", 'red'))
        sys.exit(1)

    print(colored("\n[*] Brute Force Demonstration Started", 'yellow'))
    print(colored(f"[*] Target URL: {url}", 'cyan'))
    print(colored(f"[*] Wordlist: {wordlist}", 'cyan'))
    print(colored(f"[*] Total Passwords in List: {len(passwords)}\n", 'cyan'))

    attempts = 0
    start_time = time.time()

    for password in passwords:
        attempts += 1

        # Print progress every 10 tries
        if attempts % 10 == 0:
            print(colored(f"\n[+] Attempts: {attempts}/{len(passwords)} | LastChecked : {passwords[attempts-1]}", 'blue'))

        # Simulated password comparison
        if password == target_password:
            end_time = time.time()
            duration = end_time - start_time
            
            print("\n" + colored("🎉 PASSWORD FOUND! 🎉", 'green', attrs=['bold']))
            print(colored(f"[+] Password: {password}", 'green'))
            print(colored(f"[+] Total Attempts: {attempts}", 'green'))
            print(colored(f"[+] Time Taken: {duration:.2f} seconds", 'green'))
            return

        # Optional: Add a small delay to simulate more realistic scenario
        time.sleep(0.05)

    # If password not found
    print("\n" + colored("❌ Password not found in wordlist ❌", 'red', attrs=['bold']))
    print(colored(f"[*] Total Attempts: {attempts}", 'red'))

def main():
    parser = argparse.ArgumentParser(description='Brute Force Password Demonstration')
    parser.add_argument('-u', '--url', 
                        default='http://example.com', 
                        required=True, 
                        help='Target URL (for demonstration only)')
    parser.add_argument('-e', '--email', 
                        required=True, 
                        default='johndoe@example.com', 
                        help='Target email (for demonstration only)')
    parser.add_argument('-w', '--wordlist', 
                        required=True, 
                        help='Path to wordlist file')
    args = parser.parse_args()

    # Disclaimer
    print(colored("⚠️  IMPORTANT: This script is for EDUCATIONAL PURPOSES ONLY ⚠️", 'red', attrs=['bold']))
    print(colored("Do NOT use this script for unauthorized access to systems!\n", 'yellow'))

    try:
        bruteforce_demo(args.url, args.wordlist, PASSWORD)
    except KeyboardInterrupt:
        print(colored("\n\n[!] Operation cancelled by user.", 'yellow'))
        sys.exit(0)

if __name__ == '__main__':
    main()
