#include <WiFi.h>
#include <HTTPClient.h>
#include <SPI.h>
#include <LoRa.h>

// Wi-Fi Credentials
#define WIFI_SSID "SREVARSHAN AIRTEL"
#define WIFI_PASSWORD "9600622497"

// Firebase Configuration
const char* firebaseURL = "https://web-server-afe0c-default-rtdb.asia-southeast1.firebasedatabase.app";
const char* apiKey = "AIzaSyB2QfsFWPikZq5t5kBT5LgBhoRVez4pt34";

// LoRa Pin Definitions
#define LORA_SCK 18
#define LORA_MISO 19
#define LORA_MOSI 23
#define LORA_SS 5
#define LORA_RST 21
#define LORA_DIO0 2

void setup() {
  Serial.begin(9600);
  while (!Serial);

  // Connect to Wi-Fi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected to Wi-Fi");

  // Initialize LoRa
  LoRa.setPins(LORA_SS, LORA_RST, LORA_DIO0);
  if (!LoRa.begin(433E6)) {
    Serial.println("LoRa initialization failed!");
    while (1);
  }
  Serial.println("LoRa Receiver Initialized!");
}

void loop() {
  int packetSize = LoRa.parsePacket();
  if (packetSize) {
    String receivedData = "";

    // Read the LoRa packet
    while (LoRa.available()) {
      receivedData += (char)LoRa.read();
    }

    Serial.println("Received packet: " + receivedData);

    // Send received data to Firebase
    if (WiFi.status() == WL_CONNECTED) {
      sendToFirebase(receivedData);
    } else {
      Serial.println("Wi-Fi disconnected! Reconnecting...");
      WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    }
  }
}

void sendToFirebase(String data) {
  HTTPClient http;

  // Update the same node in Firebase
  String firebasePath = String(firebaseURL) + "/sensorData.json?auth=" + apiKey;

  // Begin HTTP request
  http.begin(firebasePath);
  http.addHeader("Content-Type", "application/json");

  // Send data as JSON
  String jsonPayload = "{\"receivedData\":\"" + data + "\"}";
  int httpResponseCode = http.PUT(jsonPayload); // Use HTTP PUT to overwrite the existing data in the node

  if (httpResponseCode > 0) {
    Serial.println("Data sent to Firebase: " + jsonPayload);
    Serial.println("HTTP Response code: " + String(httpResponseCode));
  } else {
    Serial.println("Error sending data to Firebase: " + String(http.errorToString(httpResponseCode).c_str()));
  }

  http.end();
}
