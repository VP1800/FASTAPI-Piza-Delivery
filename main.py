from fastapi import FastAPI, Form, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from static.database.db_connection import get_db_connection  # Import the connection function

app = FastAPI()

# Mount static files for CSS and images
app.mount("/static", StaticFiles(directory="static"), name="static")

# Set up templates
templates = Jinja2Templates(directory="templates")

@app.get("/", response_class=HTMLResponse)
async def read_home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/admin_dashboard", response_class=HTMLResponse)
async def read_menu(request: Request):
    return templates.TemplateResponse("admin_dashboard.html", {"request": request})

@app.get("/menu", response_class=HTMLResponse)
async def read_menu(request: Request):
    return templates.TemplateResponse("menu.html", {"request": request})

@app.get("/order", response_class=HTMLResponse)
async def order_pizza(request: Request):
    return templates.TemplateResponse("order.html", {"request": request})

@app.post("/submit_order")
async def submit_order(pizza: str = Form(...), quantity: int = Form(...)):
    # Get the database connection
    conn = get_db_connection()
    
    if conn is None:
        return {"error": "Database connection failed"}

    try:
        cursor = conn.cursor()
        # Execute the query to insert data
        cursor.execute("INSERT INTO orders (pizza, quantity) VALUES (%s, %s)", (pizza, quantity))
        conn.commit()
        return {"message": f"Order for {quantity} {pizza}(s) received!"}

    except Exception as e:
        return {"error": f"An error occurred: {str(e)}"}

    finally:
        # Close the connection
        conn.close()
