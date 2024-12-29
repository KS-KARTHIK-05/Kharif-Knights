# Smart Agriculture System Using LoRa and Firebase 🌱📡  

This project demonstrates how IoT, LoRa technology, and cloud integration can revolutionize agriculture by enabling long-range, low-power wireless communication to monitor environmental conditions and provide real-time data to farmers.  

---

## **Overview**  

In this project:  
1. Sensors collect temperature, humidity, and soil moisture data.  
2. The data is transmitted wirelessly using LoRa (Long Range) technology.  
3. Firebase Realtime Database (RTDB) stores the received data in the cloud.  
4. A web-based dashboard displays the real-time data for easy monitoring.  

We also plan to integrate AI models for advanced predictions and insights in the future. Stay tuned!  

---

## **Project Components**  

### Hardware  
- **Arduino Uno**: Acts as the transmitter, collecting sensor data.  
- **ESP32**: Serves as the receiver and uploads the data to Firebase.  
- **LoRa SX1278 Modules**: Handles wireless communication between the transmitter and receiver.  
- **DHT11 Sensor**: Measures temperature and humidity.  
- **Soil Moisture Sensor**: Reads soil moisture levels.  

### Software  
- Arduino IDE: For programming the Arduino Uno and ESP32.  
- Firebase RTDB: Cloud platform to store and retrieve data.  
- HTTPClient Library: For HTTP communication between ESP32 and Firebase.  
- HTML, CSS, and JS: For the dynamic web dashboard (future implementation).  

---

## **Flow of Execution**  

### 1. **Data Collection**  
The **Arduino Uno** is connected to the **DHT11 sensor** and **Soil Moisture Sensor**. It collects:  
- **Temperature** and **Humidity** readings from the DHT11.  
- **Soil Moisture Level** in percentage from the Soil Moisture Sensor.  

### 2. **Data Transmission**  
The Arduino processes the data and sends it to the **LoRa transmitter module**, which transmits the data wirelessly to the receiver.  

### 3. **Data Reception**  
The **ESP32** is connected to the **LoRa receiver module**, which receives the transmitted data. The ESP32 processes this data for further actions.  

### 4. **Cloud Integration**  
The ESP32 uses the **HTTPClient library** to send the received data to **Firebase RTDB**.  
- The database stores the data under a structured JSON node, e.g.,  
  ```json
  {
    "temperature": "25°C",
    "humidity": "60%",
    "soilMoisture": "45%"
  }
  ```  

### 5. **Web-Based Monitoring**  
A web interface (HTML, CSS, and JS) will visualize the Firebase data in real-time, enabling farmers to monitor their fields remotely.  

---

## **Pin Connections**  

### Arduino Uno + Sensors + LoRa  
- **DHT11**: The data pin of the DHT11 is connected to Pin 8.  
- **Soil Moisture Sensor**:  
  - Analog Output (AO) is connected to A0.  
  - Digital Output (DO) is connected to Pin 3 (optional).  
- **LoRa Module**:  
  - SCK to Pin 13  
  - MISO to Pin 12  
  - MOSI to Pin 11  
  - NSS (CS) to Pin 10  
  - RST to Pin 9  
  - DIO0 to Pin 2  

### ESP32 + LoRa  
- **LoRa Module**:  
  - SCK to Pin 18  
  - MISO to Pin 19  
  - MOSI to Pin 23  
  - NSS (CS) to Pin 5  
  - RST to Pin 21  
  - DIO0 to Pin 2  

---

## **Code Files**  

1. **Arduino_Transmitter.ino**  
   This code runs on the Arduino Uno. It:  
   - Reads data from the DHT11 and Soil Moisture Sensor.  
   - Transmits the data via the LoRa module.  

2. **ESP32_Receiver.ino**  
   This code runs on the ESP32. It:  
   - Receives data from the LoRa module.  
   - Sends the data to Firebase RTDB using the HTTPClient library.  

---

## **How to Run the Project**  

1. **Transmitter (Arduino Uno)**:  
   - Connect the sensors and LoRa module as per the pin configuration above.  
   - Upload `Arduino_Transmitter.ino` to the Uno using Arduino IDE.  

2. **Receiver (ESP32)**:  
   - Connect the LoRa module to the ESP32 as per the pin configuration above.  
   - Update your Wi-Fi credentials, Firebase URL, and secret key in `ESP32_Receiver.ino`.  
   - Upload the code to the ESP32 using Arduino IDE.  

3. **Monitor Data**:  
   - Open the Serial Monitor for both the Uno and ESP32 to observe data transmission and reception.  
   - Check Firebase RTDB for real-time updates of sensor data.  

---

## **Future Enhancements**  

- Integration of **AI models** to predict trends and provide actionable insights to farmers.  
- Advanced web dashboard with real-time data visualization and analytics.  

---

