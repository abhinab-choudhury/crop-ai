import uvicorn
import os

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))

    print(f"Starting server with auto-reload on http://127.0.0.1:{port}")

    uvicorn.run(
        "app.main:app",
        host="127.0.0.1",
        port=port,
        reload=True
    )
