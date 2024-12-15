from fastapi import FastAPI, Form, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from database.db_connection import get_db_connection
from fastapi.templating import Jinja2Templates

app = FastAPI()

# Mount static files for CSS and images
app.mount("/static", StaticFiles(directory="static"), name="static")

# Set up templates
templates = Jinja2Templates(directory="templates")

@app.get("/", response_class=HTMLResponse)
async def read_home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/menu", response_class=HTMLResponse)
async def read_menu(request: Request):
    return templates.TemplateResponse("menu.html", {"request": request})

@app.get("/order", response_class=HTMLResponse)
async def order_pizza(request: Request):
    return templates.TemplateResponse("order.html", {"request": request})

@app.post("/submit_order")
async def submit_order(pizza: str = Form(...), quantity: int = Form(...)):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO orders (pizza, quantity) VALUES (?, ?)", (pizza, quantity))
    conn.commit()
    conn.close()
    return {"message": f"Order for {quantity} {pizza}(s) received!"}
