# MongoDB Connection Guide

This guide will help you set up and connect MongoDB to the ReadWell application.

## Option 1: Local MongoDB Installation (Recommended for Development)

### Step 1: Install MongoDB

**Windows:**
1. Download MongoDB Community Server from: https://www.mongodb.com/try/download/community
2. Run the installer
3. Choose "Complete" installation
4. Install MongoDB as a Windows Service (recommended)
5. Install MongoDB Compass (GUI tool - optional but helpful)

**macOS:**
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community
```

**Linux (Ubuntu/Debian):**
```bash
# Import MongoDB public GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Create list file
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Update and install
sudo apt-get update
sudo apt-get install -y mongodb-org
```

### Step 2: Start MongoDB

**Windows:**
- MongoDB should start automatically as a service
- Or open Command Prompt as Administrator and run: `mongod`
- Or start from Services: `services.msc` → Find "MongoDB" → Start

**macOS:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
sudo systemctl enable mongod  # Start on boot
```

### Step 3: Verify MongoDB is Running

```bash
# Check if MongoDB is running
mongosh  # or mongo (older versions)

# You should see: MongoDB shell version...
# Type: exit
```

**Or test connection:**
```bash
# Windows
mongosh "mongodb://localhost:27017"

# macOS/Linux
mongosh
```

### Step 4: Configure Application

Create a `.env` file in the `backend` folder:

```env
MONGODB_URI=mongodb://localhost:27017/readwell
PORT=5000
JWT_SECRET=your-secret-key-change-in-production
```

**That's it!** The application will automatically connect when you start the server.

---

## Option 2: MongoDB Atlas (Cloud - No Installation Needed)

MongoDB Atlas is a free cloud database service. Perfect if you don't want to install MongoDB locally.

### Step 1: Create MongoDB Atlas Account

1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up for a free account
3. Verify your email

### Step 2: Create a Free Cluster

1. Click "Build a Database"
2. Choose "FREE" (M0) tier
3. Select a cloud provider and region (choose closest to you)
4. Click "Create"

### Step 3: Create Database User

1. Go to "Database Access" in left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Enter username and password (save these!)
5. Set privileges to "Atlas admin" or "Read and write to any database"
6. Click "Add User"

### Step 4: Whitelist Your IP Address

1. Go to "Network Access" in left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development)
   - Or add your specific IP address
4. Click "Confirm"

### Step 5: Get Connection String

1. Go to "Database" in left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
   - It looks like: `mongodb+srv://username:password@cluster.mongodb.net/`
5. Replace `<password>` with your database user password
6. Add database name at the end: `...mongodb.net/readwell`

### Step 6: Configure Application

Create a `.env` file in the `backend` folder:

```env
MONGODB_URI=mongodb+srv://yourusername:yourpassword@cluster0.xxxxx.mongodb.net/readwell?retryWrites=true&w=majority
PORT=5000
JWT_SECRET=your-secret-key-change-in-production
```

**Replace:**
- `yourusername` with your Atlas username
- `yourpassword` with your Atlas password
- `cluster0.xxxxx` with your cluster address

---

## Testing the Connection

### Method 1: Start the Server

```bash
cd backend
npm start
```

You should see:
```
✅ Connected to MongoDB
📊 Database: readwell
🚀 Server running on port 5000
```

### Method 2: Test with MongoDB Compass

1. Download MongoDB Compass: https://www.mongodb.com/products/compass
2. Connect using:
   - **Local:** `mongodb://localhost:27017`
   - **Atlas:** Your connection string from Step 5

---

## Troubleshooting

### Error: "Cannot connect to MongoDB"

**For Local MongoDB:**
1. Check if MongoDB is running:
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   sudo systemctl status mongod
   ```

2. Start MongoDB if not running:
   ```bash
   # Windows (as Administrator)
   mongod
   
   # macOS
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

3. Check if port 27017 is available:
   ```bash
   # Windows
   netstat -an | findstr 27017
   
   # macOS/Linux
   lsof -i :27017
   ```

**For MongoDB Atlas:**
1. Verify your IP is whitelisted
2. Check username and password are correct
3. Verify connection string format
4. Check if cluster is running (should be green in Atlas dashboard)

### Error: "Authentication failed"

- Double-check username and password in connection string
- Make sure password doesn't contain special characters that need URL encoding
- Verify database user has correct permissions

### Error: "Network timeout"

- Check your internet connection
- Verify IP address is whitelisted in Atlas
- Try connecting from MongoDB Compass first

### Error: "Database name not found"

- This is normal! MongoDB will create the database automatically when you first save data
- The database `readwell` will be created when you sign up your first user

---

## Quick Connection Strings

### Local MongoDB (Default)
```
mongodb://localhost:27017/readwell
```

### MongoDB Atlas Format
```
mongodb+srv://username:password@cluster.mongodb.net/readwell?retryWrites=true&w=majority
```

---

## Security Notes

1. **Never commit `.env` file to Git** - It contains sensitive information
2. **Use strong JWT_SECRET** in production
3. **Restrict IP access** in MongoDB Atlas for production
4. **Use environment variables** for all sensitive data

---

## Need Help?

- MongoDB Documentation: https://docs.mongodb.com/
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com/
- MongoDB Community Forums: https://developer.mongodb.com/community/forums/

