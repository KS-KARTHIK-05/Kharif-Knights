#include <SPI.h>
#include <LoRa.h>
#include <DHT.h>

// Pin Definitions
#define LORA_SCK 13
#define LORA_MISO 12
#define LORA_MOSI 11
#define LORA_SS 10
#define LORA_RST 9
#define LORA_DIO0 2
#define DHT_PIN 8         // DHT11 data pin
#define SOIL_MOISTURE_AO A0 // Soil Moisture Analog pin
#define SOIL_MOISTURE_DO 3  // Soil Moisture Digital pin (optional)

#define DHT_TYPE DHT11    // DHT sensor type

DHT dht(DHT_PIN, DHT_TYPE);

// Soil Moisture Sensor Calibration (adjust values if necessary)
#define SOIL_MAX 800 // Dry value (100% dry)
#define SOIL_MIN 253   // Wet value (100% wet)

void setup() {
  Serial.begin(9600);
  while (!Serial);

  Serial.println("Initializing LoRa Transmitter...");

  // Initialize LoRa
  LoRa.setPins(LORA_SS, LORA_RST, LORA_DIO0);
  if (!LoRa.begin(433E6)) {
    Serial.println("LoRa initialization failed!");
    while (1);
  }
  Serial.println("LoRa Transmitter Initialized!");

  // Initialize DHT Sensor
  dht.begin();
  Serial.println("DHT Sensor Initialized!");
}

void loop() {
  // Read DHT11 Data
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();

  // Read Soil Moisture Data
  int soilMoistureLevel = analogRead(SOIL_MOISTURE_AO);

  // Calculate Soil Moisture Percentage
  int soilMoisturePercent = map(soilMoistureLevel, SOIL_MIN, SOIL_MAX, 100, 0);
  soilMoisturePercent = constrain(soilMoisturePercent, 0, 100); // Limit between 0% and 100%

  // Check if DHT sensor readings are valid
  if (isnan(temperature) || isnan(humidity)) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }

  // Print Data to Serial Monitor
  Serial.print("Temperature: ");
  Serial.print(temperature);
  Serial.print("°C, Humidity: ");
  Serial.print(humidity);
  Serial.print("%, Soil Moisture: ");
  Serial.print(soilMoisturePercent);
  Serial.println("%");

  // Create Message
  String message = "Temp:" + String(temperature) + "C,Hum:" + String(humidity) + "%,Soil:" + String(soilMoisturePercent) + "%";
  Serial.println("Sending: " + message);

  // Send Data via LoRa
  LoRa.beginPacket();
  LoRa.print(message);
  LoRa.endPacket();

  delay(2000);  // Send every 5 seconds
}
