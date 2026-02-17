# 🚀 Deploy Backend to Render.com - Step by Step

## Prerequisites
- GitHub account (you have this ✅)
- Render.com account (free)
- Your code is already pushed to GitHub ✅

## Step 1: Sign Up for Render.com

1. Go to **https://render.com**
2. Click **"Get Started"**
3. Sign up with **GitHub** (easiest option)
4. Authorize Render to access your repositories

## Step 2: Create New Web Service

1. Click **"New +"** button (top right)
2. Select **"Web Service"**
3. Connect your repository:
   - Click **"Connect account"** if needed
   - Find: **MSN-2007/farmconnect**
   - Click **"Connect"**

## Step 3: Configure Web Service

Fill in these settings:

### Basic Settings
- **Name**: `farmconnect-backend` (or any name you like)
- **Region**: Choose closest to you (e.g., Singapore for India)
- **Branch**: `master`
- **Root Directory**: Leave blank
- **Runtime**: `Node`

### Build & Deploy Settings
- **Build Command**: `npm install`
- **Start Command**: `node server.js`

### Instance Type
- **Free** (select the free tier)

## Step 4: Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add ALL these variables (copy from your `.env` file):

```
NODE_ENV=production
PORT=10000
MONGO_URI=mongodb+srv://farmconnect_user:WaDTPbHb4MfSX9ar@cluster0db01.tq75ums.mongodb.net/farm-connect?retryWrites=true&w=majority&appName=Cluster0db01
JWT_SECRET=5b417681b633a8f352664950d647b2f1b1474d5a5012627de23b68efd5d936c77f5cd5a2e45d0743e4d22bb93e125430a5f0e1234d7c8a95b6e3f891c0a2d4f5e
CLOUDINARY_CLOUD_NAME=doolbqk5q
CLOUDINARY_API_KEY=492464894468283
CLOUDINARY_API_SECRET=Y39ct08eKPn9S3A90XwX1VKcQnc
WEATHER_API_KEY=b6907d289e10d714a6e88b30761fae22
WEATHER_API_KEY_BACKUP=60d62d2896504a7491d9e26244795ceb
AI_GEMINI_KEY=AIzaSyATx3_mIwFlYEJgcuQcr4mJxKxG2UZp25g
NEWS_API_KEY_1=api_live_5XIhYMURQO0LJfdplNHmV2NxrWEVY3Pn9LG8LEHCr9na92v3qczWq
NEWS_API_KEY_2=api_live_J5YSkQljJqm60rZvMvZhKdp7rSVc4fOfc4T4EiQy
NEWS_API_KEY_3=api_live_6UBOL6O2FD9ZQXk5GokxpMT5z7KZXBmXvoxaV9uq8XMrcf380SclmpS2rg
NEWS_API_KEY_4=335520ed34e54e47858f15693f9634ab
FRONTEND_URL=https://farmconnect-24o6o703i-smashs-projects-cf900e59.vercel.app
```

**IMPORTANT**: Update `FRONTEND_URL` with your actual Vercel URL!

## Step 5: Deploy!

1. Click **"Create Web Service"**
2. Wait 2-5 minutes for deployment
3. You'll see build logs in real-time
4. When done, you'll get a URL like: `https://farmconnect-backend-77k4.onrender.com`

## Step 6: Update Vercel Frontend

Once backend is deployed, you need to connect frontend to it:

### 6.1 Update Vercel Environment Variables

1. Go to **Vercel Dashboard**
2. Select your **farmconnect** project
3. Go to **Settings** → **Environment Variables**
4. Add/Update:
   ```
   VITE_API_URL=https://farmconnect-backend-77k4.onrender.com
   ```
5. Click **Save**

### 6.2 Redeploy Frontend

Go to **Deployments** tab → Click **"Redeploy"** on latest deployment

OR push a small change:
```bash
git commit --allow-empty -m "Update backend URL"
git push
```

## Step 7: Test Everything

### Test Backend Directly
Visit: `https://farmconnect-backend-77k4.onrender.com/api/csrf-token`

Should return:
```json
{"csrfToken": "some-token-here"}
```

### Test Frontend
1. Visit your Vercel URL
2. Try to login/register
3. Create a listing
4. Post in community
5. Check if images upload

## 🎉 You're Done!

Your app is now fully deployed:
- **Frontend**: Vercel (fast, global CDN)
- **Backend**: Render.com (reliable, free tier)
- **Database**: MongoDB Atlas (cloud database)

## ⚠️ Important Notes

### Free Tier Limitations
- Render free tier **spins down after 15 minutes of inactivity**
- First request after spin-down takes 30-60 seconds
- Subsequent requests are fast

### Keep Backend Awake (Optional)
Use a service like **UptimeRobot** to ping your backend every 10 minutes:
1. Sign up at uptimerobot.com
2. Add monitor: `https://farmconnect-backend-77k4.onrender.com/api/csrf-token`
3. Check interval: 10 minutes

## 🐛 Troubleshooting

### Backend won't start
- Check **Logs** tab in Render dashboard
- Verify all environment variables are set
- Check MongoDB connection string

### Frontend can't connect to backend
- Verify `VITE_API_URL` in Vercel
- Check CORS settings in `server.js`
- Update `FRONTEND_URL` in Render environment variables

### Images not uploading
- Verify Cloudinary credentials in Render
- Check file size limits

## 📞 Need Help?

If you get stuck, share:
1. Screenshot of Render logs
2. Error message from browser console
3. Which step you're on

Good luck! 🚀
