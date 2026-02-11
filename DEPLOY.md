# 🚀 Quick Start: Deploy to Vercel

**Time**: ~20 minutes | **For**: Testing deployment

---

## ✅ Pre-Flight Checklist

Before deploying, verify:

- [ ] MongoDB Atlas account ready (or connection string)
- [ ] Cloudinary account credentials
- [ ] Gemini API key
- [ ] `.env` file has all required variables
- [ ] Code committed to Git (optional, for GitHub method)

---

## 🎯 3-Step Deploy

### Step 1: Set Up MongoDB (5 min)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create **Free M0 cluster**
3. Create database user
4. **Network Access** → Add IP: `0.0.0.0/0` (allow all)
5. Copy connection string

### Step 2: Deploy to Vercel (10 min)

**Option A: CLI (Faster)**
```bash
npm install -g vercel
vercellogin
vercel --prod
```

**Option B: GitHub**
1. Push to GitHub
2. https://vercel.com/new → Import repo
3. Deploy

### Step 3: Add Environment Variables (5 min)

**Vercel Dashboard** → Your Project → Settings → Environment Variables

**Copy-paste these** (update values from your `.env`):

```bash
MONGO_URI=mongodb+srv://your-atlas-connection
JWT_SECRET=5b417681b633a8f352664950d647b2f1b1474d5a5012627de23b68efd5d936c77f5cd5a2e45d0743e4d22bb93e125430a5f0e1234d7c8a95b6e3f891c0a2d4f5e
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
VITE_AI_GEMINI_KEY=your_gemini_key
VITE_WEATHER_API_KEY_APAC=your_weather_key
NODE_ENV=production
```

**After first deploy, add:**
```bash
VITE_API_URL=https://your-vercel-url.vercel.app
FRONTEND_URL=https://your-vercel-url.vercel.app
```

Then: **Redeploy** (Vercel dashboard → Deployments → Redeploy)

---

## 🧪 Test Your Deployment

1. Visit your Vercel URL
2. Register new account
3. Try creating a listing
4. Check browser console (F12) for errors

---

## ❌ Common Errors

| Error | Fix |
|-------|-----|
| MongoDB connection failed | Check `MONGO_URI` and IP whitelist |
| 404 on API calls | Add `VITE_API_URL` env var |
| CORS error | Set `FRONTEND_URL` to match deployment URL |
| Images not uploading | Verify all 3 Cloudinary env vars |

---

## 📚 Full Documentation

For complete guide, see [vercel_deployment.md](file:///C:/Users/sumiy/.gemini/antigravity/brain/bb858525-9be6-4cbd-916c-ce98c4a79ede/vercel_deployment.md)

---

**Ready to deploy?** Run: `vercel --prod`
