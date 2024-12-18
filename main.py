from fastapi import FastAPI, Form, Request, Depends
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from starlette.status import HTTP_303_SEE_OTHER
from static.database.db_connection import get_db_connection  # Import the connection function
import mysql.connector

app = FastAPI()

# Mount static files for CSS and images
app.mount("/static", StaticFiles(directory="static"), name="static")

# Set up templates
templates = Jinja2Templates(directory="templates")


@app.get("/", response_class=HTMLResponse)
async def read_home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


@app.post("/login", response_class=HTMLResponse)
async def login(
    request: Request,
    username: str = Form(...),
    password: str = Form(...),
):
    connection = get_db_connection()
    if not connection:
        return templates.TemplateResponse(
            "index.html",
            {"request": request, "error": "Database connection error"},
        )

    try:
        cursor = connection.cursor(dictionary=True)
        query = """
            SELECT * FROM tbl_user 
            WHERE mail = %s AND password = %s limit 1
        """
        cursor.execute(query, (username, password))  # Use placeholders for safety
        user = cursor.fetchone()

        if user:
            user_type = user["type"]
            if user_type == "admin":
                return RedirectResponse(f"/admin_dashboard", status_code=HTTP_303_SEE_OTHER)
            elif user_type == "user":
                return RedirectResponse(f"/user_dashboard", status_code=HTTP_303_SEE_OTHER)
        else:
            return templates.TemplateResponse(
                "index.html", {"request": request, "error": "Invalid credentials"}
            )
    except mysql.connector.Error as err:
        return templates.TemplateResponse(
            "index.html", {"request": request, "error": f"Database error: {err}"}
        )
    finally:
        cursor.close()
        connection.close()

@app.get("/dashboard-data")
async def get_dashboard_data():
    connection = get_db_connection()
    if not connection:
        return JSONResponse(content={"error": "Database connection failed"}, status_code=500)

    try:
        cursor = connection.cursor(dictionary=True)

        # Fetch total orders
        cursor.execute("SELECT COUNT(*) AS total_orders FROM tbl_order")
        total_orders = cursor.fetchone()["total_orders"]

        # Fetch total revenue
        cursor.execute("SELECT SUM(total) AS revenue FROM tbl_order")
        revenue = cursor.fetchone()["revenue"] or 0

        # Fetch pending orders
        cursor.execute("SELECT COUNT(*) AS pending_orders FROM tbl_order WHERE status != 'Delivered'")
        pending_orders = cursor.fetchone()["pending_orders"]

        # Fetch total customers
        cursor.execute("SELECT COUNT(DISTINCT u_id) AS customers FROM tbl_user")
        customers = cursor.fetchone()["customers"]

        return {
            "total_orders": total_orders,
            "revenue": revenue,
            "pending_orders": pending_orders,
            "customers": customers,
        }
    finally:
        cursor.close()
        connection.close()

@app.get("/admin_dashboard", response_class=HTMLResponse)
async def admin_dashboard(request: Request):
    return templates.TemplateResponse("admin_dashboard.html", {"request": request})

@app.get("/admin_orders", response_class=HTMLResponse)
async def admin_orders(request: Request):
    return templates.TemplateResponse("admin_orders.html", {"request": request})

@app.get("/customers", response_class=HTMLResponse)
async def customers(request: Request):
    return templates.TemplateResponse("customers.html", {"request": request})

@app.get("/admin_products", response_class=HTMLResponse)
async def admin_products(request: Request):
    return templates.TemplateResponse("admin_products.html", {"request": request})

@app.get("/delivery", response_class=HTMLResponse)
async def delivery(request: Request):
    return templates.TemplateResponse("delivery.html", {"request": request})

# @app.get("/user_dashboard", response_class=HTMLResponse)
# async def user_dashboard(request: Request):
#     return templates.TemplateResponse("user_dashboard.html", {"request": request})

# @app.get("/order", response_class=HTMLResponse)
# async def order(request: Request):
#     return templates.TemplateResponse("order.html", {"request": request})

# @app.get("/products", response_class=HTMLResponse)
# async def products(request: Request):
#     return templates.TemplateResponse("products.html", {"request": request})

# @app.get("/about", response_class=HTMLResponse)
# async def about(request: Request):
#     return templates.TemplateResponse("about.html", {"request": request})

# @app.get("/menu", response_class=HTMLResponse)
# async def read_menu(request: Request):
#     return templates.TemplateResponse("menu.html", {"request": request})

# @app.get("/order", response_class=HTMLResponse)
# async def order_pizza(request: Request):
#     return templates.TemplateResponse("order.html", {"request": request})

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
