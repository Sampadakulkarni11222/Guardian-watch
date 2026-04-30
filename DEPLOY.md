# 🚀 Deployment Guide: Guardian-Watch

This project contains two main components:
1.  **Python Dashboard**: A Streamlit-based AI analysis tool (`dashboard.py`).
2.  **React HUD**: A premium React-based monitoring interface (`crime-analytics/`).

---

## 🌐 Option 1: Deploy on Render (Recommended for Both)

I have created a `render.yaml` blueprint. This will automatically set up both the Python backend and the React frontend.

1.  Push your code to **GitHub** or **GitLab**.
2.  Log in to [Render](https://render.com/).
3.  Click **New +** and select **Blueprint**.
4.  Connect your repository.
5.  Render will detect the `render.yaml` and set up:
    -   **`guardian-watch-dashboard`**: The Streamlit app.
    -   **`guardian-watch-frontend`**: The React static site.

---

## ⚡ Option 2: Deploy React on Vercel

If you prefer Vercel for the frontend:

1.  Go to [Vercel](https://vercel.com/).
2.  Click **Add New** -> **Project**.
3.  Import your repository.
4.  In the **Root Directory** setting, click "Edit" and select the `crime-analytics` folder.
5.  Vercel will automatically detect Vite. Click **Deploy**.

---

## 🛠️ Configuration Details

### Python Dependencies
The `requirements.txt` includes:
- `streamlit`, `pandas`, `scikit-learn`, `pydeck`, `matplotlib`, `joblib`, `Pillow`.

### Static Assets
- Crime images have been moved to `crime-analytics/public/crime_images/` to ensure they are bundled correctly during the frontend build.
- `data.json` has been pre-processed and saved in the React source folder.

### Port Configuration
- The `Procfile` and `render.yaml` use the `$PORT` environment variable required by Render.
