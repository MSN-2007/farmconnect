# 🚀 Pre-Deployment Checklist for FarmConnect

**Complete this checklist before deploying to production**

---

## ✅ 1. Environment Configuration

### MongoDB Database
- [ ] MongoDB Atlas account created
- [ ] Free M0 cluster created (or paid tier)
- [ ] Database user created with strong password
- [ ] Network Access configured (IP: `0.0.0.0/0` for all access)
- [ ] Connection string copied
- [ ] Update `.env`: `MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/farm-connect`

### Cloudinary (Image Uploads)
- [ ] Cloudinary account created at https://cloudinary.com
- [ ] Cloud name noted
- [ ] API Key and API Secret copied
- [ ] Update `.env`:
  ```
  CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
  CLOUDINARY_API_KEY=your_actual_api_key
  CLOUDINARY_API_SECRET=your_actual_api_secret
  ```

### JWT Secret
- [ ] Verify JWT_SECRET is strong (64+ characters)
- [ ] **NEVER** use default or example values
- [ ] Current value: `5b417681b633a8f352664950d647b2f1b1474d5a5012627de23b68efd5d936c77f5cd5a2e45d0743e4d22bb93e125430a5f0e1234d7c8a95b6e3f891c0a2d4f5e` ✅

### API Keys Validation
- [ ] Weather API Key tested: `WEATHER_API_KEY=b6907d289e10d714a6e88b30761fae22`
- [ ] Gemini AI Key tested: `AI_GEMINI_KEY=AIzaSyATx3_mIwFlYEJgcuQcr4mJxKxG2UZp25g`
- [ ] News API Keys tested (4 keys available)

### Environment Variables for Production
- [ ] Set `NODE_ENV=production`
- [ ] Set `VITE_API_URL` to your production URL (e.g., `https://your-app.vercel.app`)
- [ ] Set `FRONTEND_URL` to your production URL

---

## 🔒 2. Security Audit

### HTTPS & Transport Security
- [ ] HTTPS enforced (HTTP redirects to HTTPS)
- [ ] SSL certificate valid
- [ ] Secure cookies enabled (`secure: true` in production)

### Authentication & Authorization
- [ ] JWT tokens stored in httpOnly cookies (NOT localStorage) ✅
- [ ] Token expiration set (currently 7 days) ✅
- [ ] Password requirements enforced (min 8 chars, uppercase, lowercase, number) ✅
- [ ] Failed login attempts tracked ✅
- [ ] Account lockout after 5 failed attempts (15 min) ✅

### Input Validation & Sanitization
- [ ] All API endpoints have input validation ✅
- [ ] NoSQL injection prevention enabled (express-mongo-sanitize) ✅
- [ ] XSS protection enabled ✅
- [ ] CSRF protection enabled ✅
- [ ] HTTP Parameter Pollution protection enabled ✅

### Rate Limiting
- [ ] General rate limit: 100 requests per 15 minutes ✅
- [ ] Auth rate limit: 5 attempts per 15 minutes ✅
- [ ] Message rate limit: 60 messages per minute ✅

### Security Headers
- [ ] Helmet.js configured ✅
- [ ] Content Security Policy (CSP) configured ✅
- [ ] CORS properly configured (only allowed origins) ✅

### Sensitive Data
- [ ] No API keys in frontend code ✅
- [ ] `.env` file NOT committed to Git ✅
- [ ] `.gitignore` includes `.env` ✅

---

## 🗄️ 3. Database Setup

### MongoDB Atlas Configuration
- [ ] Database indexes created:
  - Posts: `community` index ✅
  - Users: `phone` unique index
  - Listings: appropriate indexes
- [ ] Database backup strategy in place
- [ ] Connection pooling configured
- [ ] Test connection from local environment

### Data Validation
- [ ] All models have proper schema validation ✅
- [ ] Required fields enforced ✅
- [ ] Data types validated ✅

---

## 🔌 4. Third-Party Services

### Cloudinary
- [ ] Account created and verified
- [ ] Upload preset configured (if needed)
- [ ] Test image upload locally
- [ ] Verify images are accessible via URL

### Weather API (OpenWeatherMap)
- [ ] API key valid
- [ ] Test API call: `https://api.openweathermap.org/data/2.5/weather?lat=28.6139&lon=77.2090&appid=YOUR_KEY`
- [ ] Verify response is valid JSON

### Gemini AI
- [ ] API key valid
- [ ] Test crop disease detection feature
- [ ] Verify AI responses are appropriate

### News APIs
- [ ] At least one news API key working
- [ ] Test news feed endpoint
- [ ] Verify news articles display correctly

---

## ⚡ 5. Build & Performance

### Production Build
- [ ] Run `npm run build` successfully
- [ ] No build errors or warnings
- [ ] Bundle size reasonable (check `dist/` folder)
- [ ] Source maps generated (for debugging)

### Performance Optimization
- [ ] Images optimized (Cloudinary handles this) ✅
- [ ] Compression enabled (gzip/brotli) ✅
- [ ] Lazy loading implemented where appropriate
- [ ] Code splitting configured (Vite handles this) ✅

### Testing Build Locally
- [ ] Run `npm run preview` after build
- [ ] Test all major features in preview mode
- [ ] Check browser console for errors

---

## 🧪 6. Feature Testing

### Authentication Flow
- [ ] User registration works
- [ ] User login works
- [ ] Logout works
- [ ] "Remember me" functionality works
- [ ] Password validation works
- [ ] Account lockout works after failed attempts

### Core Features
- [ ] **Buy & Sell**: Create listing with image upload
- [ ] **Community**: Create post, like post, view posts by community
- [ ] **AI Lens**: Upload image for crop disease detection
- [ ] **AI Assistant**: Chat functionality works
- [ ] **Weather**: Weather widget displays current weather
- [ ] **Market Prices**: Price data displays correctly
- [ ] **Analytics**: Graphs display (if user has data)

### Image Uploads
- [ ] Listing images upload successfully
- [ ] Community post images upload successfully
- [ ] AI Lens image upload works
- [ ] Images display correctly after upload

### Error Handling
- [ ] Network errors show user-friendly messages
- [ ] API errors handled gracefully
- [ ] 404 page exists and works
- [ ] Loading states display correctly

### Mobile Responsiveness
- [ ] Test on mobile device or browser dev tools
- [ ] All pages responsive
- [ ] Touch interactions work
- [ ] Navigation menu works on mobile

---

## 🌐 7. Deployment Platform (Vercel)

### Vercel Setup
- [ ] Vercel account created
- [ ] Project connected (via GitHub or CLI)
- [ ] Build command: `npm run build` or `vite build`
- [ ] Output directory: `dist`
- [ ] Install command: `npm install`

### Environment Variables in Vercel
Add all these in Vercel Dashboard → Settings → Environment Variables:

```bash
# Database
MONGO_URI=mongodb+srv://your-atlas-connection-string

# Authentication
JWT_SECRET=5b417681b633a8f352664950d647b2f1b1474d5a5012627de23b68efd5d936c77f5cd5a2e45d0743e4d22bb93e125430a5f0e1234d7c8a95b6e3f891c0a2d4f5e

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# APIs
WEATHER_API_KEY=b6907d289e10d714a6e88b30761fae22
AI_GEMINI_KEY=AIzaSyATx3_mIwFlYEJgcuQcr4mJxKxG2UZp25g
NEWS_API_KEY_1=api_live_5XIhYMURQO0LJfdplNHmV2NxrWEVY3Pn9LG8LEHCr9na92v3qczWq

# Environment
NODE_ENV=production
VITE_API_URL=https://your-vercel-url.vercel.app
FRONTEND_URL=https://your-vercel-url.vercel.app
```

### Custom Domain (Optional)
- [ ] Domain purchased
- [ ] Domain added in Vercel
- [ ] DNS configured
- [ ] SSL certificate issued

---

## 🔍 8. Post-Deployment Testing

### Smoke Tests
- [ ] Visit production URL
- [ ] Homepage loads correctly
- [ ] All navigation links work
- [ ] No console errors in browser (F12)

### User Flow Testing
- [ ] Register new account
- [ ] Login with new account
- [ ] Create a listing with image
- [ ] Create a community post
- [ ] Use AI Lens feature
- [ ] Check weather widget
- [ ] View market prices
- [ ] Logout

### API Endpoint Testing
- [ ] Test `/api/auth/register`
- [ ] Test `/api/auth/login`
- [ ] Test `/api/listings`
- [ ] Test `/api/posts`
- [ ] Test `/api/weather`
- [ ] Test `/api/ai/analyze-image`

### Error Monitoring
- [ ] Check Vercel logs for errors
- [ ] Monitor MongoDB Atlas for connection issues
- [ ] Check Cloudinary dashboard for upload issues

### Performance Testing
- [ ] Test page load speed (should be < 3 seconds)
- [ ] Test on slow 3G connection
- [ ] Check Lighthouse score (aim for 80+)

### Cross-Browser Testing
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari (if available)
- [ ] Mobile browsers (Chrome, Safari)

---

## 📋 9. Final Checks

### Documentation
- [ ] README.md updated with deployment info
- [ ] API documentation complete (if applicable)
- [ ] User guide created (if needed)

### Backup & Recovery
- [ ] Database backup configured
- [ ] Environment variables documented securely
- [ ] Recovery plan in place

### Monitoring & Logging
- [ ] Error logging configured
- [ ] Performance monitoring set up (optional)
- [ ] Uptime monitoring (optional: UptimeRobot, etc.)

### Legal & Compliance
- [ ] Privacy policy added (if collecting user data)
- [ ] Terms of service added
- [ ] Cookie consent (if applicable)
- [ ] GDPR compliance (if serving EU users)

---

## 🎯 Quick Deployment Steps

1. **Setup MongoDB Atlas** (15 min)
   - Create cluster → Get connection string → Update `.env`

2. **Setup Cloudinary** (10 min)
   - Create account → Get credentials → Update `.env`

3. **Test Locally** (15 min)
   ```bash
   npm run build
   npm run preview
   # Test all features
   ```

4. **Deploy to Vercel** (10 min)
   ```bash
   npm install -g vercel
   vercel login
   vercel --prod
   ```

5. **Configure Environment Variables** (10 min)
   - Vercel Dashboard → Settings → Environment Variables
   - Add all variables from `.env`

6. **Redeploy** (5 min)
   - Vercel Dashboard → Deployments → Redeploy

7. **Test Production** (15 min)
   - Visit production URL
   - Test all critical features
   - Check for errors

---

## ⚠️ Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| MongoDB connection failed | Check `MONGO_URI` and IP whitelist in Atlas |
| 404 on API calls | Verify `VITE_API_URL` in Vercel env vars |
| CORS error | Set `FRONTEND_URL` to match deployment URL |
| Images not uploading | Verify all 3 Cloudinary env vars are correct |
| Build fails | Check for missing dependencies, run `npm install` |
| CSRF token errors | Ensure cookies are enabled, check CORS settings |
| Rate limit errors | Normal for testing, wait 15 minutes or adjust limits |

---

## 📞 Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com
- **Cloudinary Docs**: https://cloudinary.com/documentation
- **React Docs**: https://react.dev

---

**Estimated Total Time**: 1-2 hours (first deployment)

**Status**: Ready to deploy once all checkboxes are completed ✅
