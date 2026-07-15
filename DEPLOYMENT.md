# Deploy KwansoDwoo Server to Render

## Project Structure

```
kwansodwoo/
├── server/
│   ├── config/
│   │   └── firebaseAdmin.js    # Firebase Admin SDK initialization
│   ├── controllers/           # Route controllers
│   ├── middleware/            # Express middleware
│   ├── routes/
│   │   └── reports.js         # API routes for reports
│   ├── utils/                 # Utility functions
│   ├── .env.example           # Environment variables template
│   ├── index.js               # Server entry point
│   └── package.json           # Dependencies and scripts
├── client/                    # Frontend (separate deployment)
└── render.yaml                # Render deployment configuration
```

## Prerequisites

- Render account (https://render.com)
- GitHub repository with your code
- Firebase project with:
  - Storage bucket
  - Service account key

## Step-by-Step Deployment

### 1. Prepare Your Repository

Ensure your repository structure includes:
- `server/` directory with all server files
- `render.yaml` file in the root
- `.gitignore` excluding `.env` and `node_modules/`

### 2. Configure Firebase Storage CORS

**IMPORTANT**: You must configure CORS for Firebase Storage to allow file uploads from your client.

#### Option A: Using gsutil (Recommended)

1. Install [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)
2. Authenticate with Google Cloud:
   ```bash
   gcloud auth login
   ```
3. Apply the CORS configuration using the provided `cors.json` file:
   ```bash
   gsutil cors set cors.json gs://k-dwoo.firebasestorage.app
   ```
   Replace `k-dwoo.firebasestorage.app` with your actual bucket name.

4. Verify the CORS configuration:
   ```bash
   gsutil cors get gs://k-dwoo.firebasestorage.app
   ```

#### Option B: Using Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Navigate to **Storage** > **Rules**
4. Note: The Firebase Console has limited CORS configuration options
5. For full CORS control, use gsutil (Option A)

### 3. Generate Firebase Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Navigate to **Project Settings** > **Service Accounts**
4. Click **Generate New Private Key**
5. Save the JSON file securely (you'll need this for Render)

### 4. Push Code to GitHub

```bash
git add .
git commit -m "Add Render deployment configuration"
git push origin main
```

### 5. Create Render Web Service

#### Option A: Using render.yaml (Recommended)

1. Log in to [Render Dashboard](https://dashboard.render.com)
2. Click **New +** > **Web Service**
3. Connect your GitHub repository
4. Render will automatically detect `render.yaml`
5. Review the configuration and click **Create Web Service**

#### Option B: Manual Configuration

1. In Render Dashboard, click **New +** > **Web Service**
2. Connect your GitHub repository
3. Configure the following:
   - **Name**: `kwansodwoo-server`
   - **Environment**: `Node`
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
4. Click **Advanced** > **Add Environment Variable**
5. Add the variables listed below

### 6. Configure Environment Variables

In Render Dashboard, add these environment variables:

| Variable | Value | Description |
|----------|-------|-------------|
| `PORT` | `5000` | Server port (Render also provides `PORT` automatically) |
| `FIREBASE_STORAGE_BUCKET` | `your-project.appspot.com` | Your Firebase Storage bucket name |
| `FIREBASE_ADMIN_SDK_KEY` | `{entire JSON key as single line}` | Firebase service account key (see below) |

**Important**: For `FIREBASE_ADMIN_SDK_KEY`:
- Copy the entire JSON content from your service account file
- Remove all newlines (make it a single line)
- Paste as the environment variable value

Example format:
```
{"type":"service_account","project_id":"your-project","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"..."}
```

### 7. Deploy

Render will automatically:
1. Build your service (`npm install`)
2. Start your server (`npm start`)
3. Provide a public URL (e.g., `https://kwansodwoo-server.onrender.com`)

Monitor the deployment in the **Logs** tab.

### 8. Verify Deployment

Once deployed, test your API:

```bash
# Health check
curl https://your-service-url.onrender.com/api/health

# Should return:
# {"status":"ok","service":"kwansodwoo-server"}
```

## Post-Deployment Configuration

### Update Client Configuration

Update your client's API base URL to point to the new Render URL:

```javascript
// In your client code
const API_BASE_URL = 'https://kwansodwoo-server.onrender.com/api';
```

### Set Up Custom Domain (Optional)

1. In Render Dashboard, go to your service
2. Click **Settings** > **Domains**
3. Add your custom domain
4. Update DNS records as instructed

## Troubleshooting

### Build Failures

- Check the **Logs** tab for error messages
- Ensure `package.json` has correct `start` script
- Verify all dependencies are in `dependencies` (not `devDependencies`)

### Runtime Errors

- Verify environment variables are set correctly
- Check Firebase service account key format
- Ensure Firebase Storage bucket exists and is accessible

### Connection Issues

- Render services automatically handle HTTPS
- Ensure CORS is configured (already in `index.js`)
- Check Firebase security rules allow your domain

### Firebase Storage CORS Errors

If you see CORS errors when uploading files:
```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Solution**: Configure Firebase Storage CORS using gsutil:
```bash
# Install Google Cloud SDK first
gcloud auth login
gsutil cors set cors.json gs://k-dwoo.firebasestorage.app
```

Replace `k-dwoo.firebasestorage.app` with your actual bucket name.

**For development with localhost**: The provided `cors.json` allows all origins (`*`). For production, restrict to your actual domains:
```json
[
  {
    "origin": ["https://yourdomain.com", "https://your-render-app.onrender.com"],
    "method": ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
    "maxAgeSeconds": 3600
  }
]
```

## Monitoring

- View real-time logs in Render Dashboard
- Set up error monitoring (optional)
- Configure health checks in Render settings

## Cost Considerations

- Render Free Tier: Available for web services
- Paid plans start at $7/month for better performance
- Consider database needs if using external databases

## Security Best Practices

1. Never commit `.env` files or service account keys
2. Use Render's environment variables for secrets
3. Rotate Firebase service account keys periodically
4. Enable Firebase security rules
5. Use HTTPS (Render provides this automatically)
