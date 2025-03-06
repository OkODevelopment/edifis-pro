import pytest
import pandas as pd
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def get_credentials_from_excel():
    df = pd.read_excel("data/Edifis_Pro_AccessManagment.xlsx", skiprows=1, usecols=[0, 1])
    credentials = list(df.itertuples(index=False, name=None))
    return credentials

@pytest.fixture
def driver():
    options = webdriver.ChromeOptions()
    # options.add_argument("--headless")
    driver = webdriver.Chrome(options=options)
    driver.get("http://localhost:3000/login")
    yield driver
    driver.quit()

@pytest.mark.parametrize("email,password", get_credentials_from_excel())
def test_login(driver, email, password):
    email_input = driver.find_element(By.ID, "email")
    password_input = driver.find_element(By.ID, "password")
    login_button = driver.find_element(By.TAG_NAME, "button")

    email_input.send_keys(email)
    password_input.send_keys(password)
    login_button.click()

    wait = WebDriverWait(driver, 5)

    try:
        wait.until(EC.url_to_be("http://localhost:3000/dashboard"))
        print(f"✅ Connexion réussie pour {email}")
        assert driver.current_url == "http://localhost:3000/dashboard"
    except:
        print(f"❌ Échec de connexion pour {email}")
        assert False, f"Échec de connexion pour {email} - URL actuelle: {driver.current_url}"
