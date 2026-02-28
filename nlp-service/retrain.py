#!/usr/bin/env python
"""
Quick script to retrain the chatbot model
Run this after updating intents.json
"""

import subprocess
import sys

if __name__ == "__main__":
    print("🔄 Retraining chatbot model...")
    print("=" * 50)
    
    try:
        # Run training script
        result = subprocess.run([sys.executable, "train_chatbot.py"], 
                              capture_output=True, text=True, check=True)
        print(result.stdout)
        print("✅ Model retrained successfully!")
    except subprocess.CalledProcessError as e:
        print("❌ Error during training:")
        print(e.stderr)
        sys.exit(1)
    except FileNotFoundError:
        print("❌ train_chatbot.py not found!")
        sys.exit(1)

