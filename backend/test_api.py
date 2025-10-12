#!/usr/bin/env python3
"""
Test the transcript API endpoint directly
"""

import requests
import json

def test_transcript_api():
    # Test with student credentials
    # First login to get token
    login_data = {
        "email": "ridwannoor083@gmail.com",
        "password": "12345"  # Adjust this to actual password
    }
    
    try:
        # Login
        login_response = requests.post("http://127.0.0.1:5001/api/auth/login", json=login_data)
        if login_response.status_code == 200:
            token = login_response.json().get("access_token")
            
            # Get transcript
            headers = {"Authorization": f"Bearer {token}"}
            transcript_response = requests.get("http://127.0.0.1:5001/api/student/transcript", headers=headers)
            
            if transcript_response.status_code == 200:
                data = transcript_response.json()
                student = data.get("student", {})
                print("✅ Transcript API Response:")
                print(f"Name: {student.get('name')}")
                print(f"Programme: {student.get('programme')}")
                print(f"Year of Study: {student.get('year_of_study')}")
                print(f"Academic Year: {student.get('academic_year')}")
            else:
                print(f"❌ Transcript API error: {transcript_response.status_code}")
                print(transcript_response.text)
        else:
            print(f"❌ Login failed: {login_response.status_code}")
            print(login_response.text)
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_transcript_api()