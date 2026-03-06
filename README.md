<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=2E7D32,66BB6A&height=180&section=header&text=AgrosCare&fontSize=52&fontColor=ffffff&fontAlignY=38&desc=Long-Range%20IoT%20Sensor%20Network%20for%20Precision%20Agriculture&descSize=14&descAlignY=62" width="100%"/>

<br/>

[![Platform](https://img.shields.io/badge/Hardware-Arduino_+_ESP32-00979D?style=for-the-badge&logo=arduino&logoColor=white)](.)
[![Protocol](https://img.shields.io/badge/Protocol-LoRa_SX1278-2E7D32?style=for-the-badge)](.)
[![Cloud](https://img.shields.io/badge/Cloud-Firebase_RTDB-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com)
[![Range](https://img.shields.io/badge/Range-Up_to_10km-66BB6A?style=for-the-badge)](.)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

<br/>

```
╔══════════════════════════════════════════════════════════════════════════╗
║  Built for cotton fields  ·  Real-time infestation alerts               ║
║  FOG computing bridge  ·  LoRa long-range  ·  Firebase cloud sync       ║
║  Top 8 National  ·  NAF Uzhavu @ IITM  ·  IIM Product Mentorship        ║
╚══════════════════════════════════════════════════════════════════════════╝
```

</div>

---

## The Problem I Solved

> Cotton is India's **"White Gold"** — but it's also one of the most vulnerable crops. Pest infestations, particularly bollworm and whitefly attacks, can wipe out an entire season's yield within days. India loses an estimated **₹8,000+ crore annually** to cotton crop failure from late-detected infestations.

The core failure is **detection latency**. Cotton fields are vast, often in remote rural areas with no cellular coverage. By the time a farmer physically spots infestation signs, the damage has already spread across rows. Early warning — at the soil and microclimate level — simply doesn't exist for most farmers.

**AgrosCare** solves detection latency at its root. A high-precision multi-sensor probe inserted directly into the cotton field measures the exact environmental conditions that precede and accompany infestation events — continuously, autonomously, without any internet at the field site.

Data travels via **LoRa** to a **FOG computing node** which bridges the internet-less field to the cloud — then into **Firebase RTDB** for real-time alerts and monitoring accessible from any device, anywhere.

---

## Recognition

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│   🏆  TOP 8 — National NAF Uzhavu Hackathon                         │
│        Conducted by IIT Madras (IITM)                               │
│        Competed against teams from across India                     │
│                                                                     │
│   🎓  IIM PRODUCT MENTORSHIP                                        │
│        Selected for mentorship from IIM product experts             │
│        Guided on commercialisation, GTM strategy, and               │
│        scaling AgrosCare as a deployable agricultural product       │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

Reaching the **Top 8 nationally at an IIT Madras-conducted hackathon** validated the core hypothesis: cotton farmers need real-time infestation intelligence at the field level, not just weather data. The IIM mentorship session pushed the project beyond engineering — into product-market fit, sensor probe manufacturing cost, and rural distribution networks.

---

## What I Built

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                    AGROSCARE — SYSTEM ARCHITECTURE                           │
│                                                                              │
│   ┌─────────────────────────────┐                                            │
│   │   SENSOR PROBE (Field)      │  High-accuracy array embedded in soil      │
│   │   ─────────────────────     │                                            │
│   │   · Soil Moisture           │                                            │
│   │   · Temperature             │                                            │
│   │   · Humidity                │                                            │
│   │   · VOC / gas sensors for   │                                            │
│   │     infestation signature   │                                            │
│   └──────────────┬──────────────┘                                            │
│                  │ Arduino Uno — sensor acquisition + LoRa TX                │
│                  ▼                                                           │
│   ┌──────────────────────────┐                                               │
│   │   LoRa SX1278            │  Up to 10km  ·  Sub-GHz  ·  Zero internet    │
│   └──────────────┬───────────┘                                               │
│                  ▼                                                           │
│   ┌──────────────────────────────────────────────────────┐                  │
│   │   FOG COMPUTING NODE  (ESP32 + LoRa RX)              │                  │
│   │   ──────────────────────────────────────────────     │                  │
│   │   Bridges internet-less field ──► internet zone      │                  │
│   │   Local pre-processing  ·  Threshold checks          │                  │
│   │   Buffers data during connectivity gaps              │                  │
│   └──────────────────────────┬───────────────────────────┘                  │
│                              │  WiFi / HTTP                                  │
│                              ▼                                               │
│   ┌──────────────────────────────────────────────────────┐                  │
│   │   Firebase Realtime Database (Cloud)                 │                  │
│   └──────────────────────────┬───────────────────────────┘                  │
│                              ▼                                               │
│   ┌──────────────────────────────────────────────────────┐                  │
│   │   Real-Time Dashboard + Infestation Alert            │                  │
│   │   Accessible from any device  ·  Instant alerts      │                  │
│   └──────────────────────────────────────────────────────┘                  │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Why FOG Computing — Not Just Cloud

Most IoT agriculture projects assume internet at the field. Cotton fields in Tamil Nadu, Telangana, and Maharashtra often have none.

The FOG node sits at the **edge of the network** — physically close to the field, within LoRa range — and acts as a local processing and buffering layer. It pre-processes sensor readings, applies threshold logic locally, and only pushes structured alerts upstream to Firebase. This means:

- **Zero data loss** during internet outages
- **Faster local alerts** without cloud round-trip latency
- **Reduced cloud costs** — only anomalies and summaries are uploaded, not raw streams

---

## Why LoRa — Not WiFi, Not GSM

```
┌─────────────────┬──────────┬───────────┬──────────┬────────────────┐
│  Protocol       │  Range   │  Power    │  Cost    │  Infra Needed  │
├─────────────────┼──────────┼───────────┼──────────┼────────────────┤
│  WiFi           │  ~50m    │  High     │  Low     │  Router nearby │
│  GSM / 4G       │  Wide    │  Very High│  High    │  SIM + network │
│  Zigbee         │  ~100m   │  Low      │  Medium  │  Mesh nodes    │
│  LoRa SX1278 ✓  │  ~10km   │  Very Low │  Very Low│  None          │
└─────────────────┴──────────┴───────────┴──────────┴────────────────┘
```

LoRa wins for agricultural deployment because fields are large, power is scarce, and cellular coverage in rural India is unreliable. A single LoRa gateway can cover an entire farm — no towers, no SIM cards, no monthly bills.

---

## Real-World Impact

```
┌───────────────────────────────────────────────────────────────────┐
│  BEFORE AgrosCare                                                 │
│  ─────────────────────────────────────────────────────────────   │
│  Farmer spots infestation only when visible damage appears        │
│  No environmental data — decisions made purely on intuition       │
│  Fields in connectivity-dead zones = zero remote monitoring       │
│  Infestation spreads 3–5 rows before detection                    │
├───────────────────────────────────────────────────────────────────┤
│  AFTER AgrosCare                                                  │
│  ─────────────────────────────────────────────────────────────   │
│  Multi-sensor probe detects pre-infestation environmental shifts  │
│  Real-time alert delivered to dashboard before visible damage     │
│  FOG node ensures zero data loss in zero-connectivity fields      │
│  Historical telemetry enables seasonal infestation pattern maps   │
└───────────────────────────────────────────────────────────────────┘
```

---

## Hardware

```
sre@agroscare:~$ lshw --field-nodes
```

| Component | Role | Notes |
|---|---|---|
| **Arduino Uno** | Sensor probe acquisition + LoRa TX | Field transmitter unit |
| **ESP32 Dev Kit v1** | FOG node — LoRa RX + Firebase upload | Gateway unit |
| **LoRa SX1278** | Wireless link (up to 10km, sub-GHz) | One on each node |
| **DHT11 Sensor** | Temperature + humidity | Connected to Uno Pin 8 |
| **Soil Moisture Sensor** | Volumetric moisture % | Analog on Uno A0 |

---

## Data Schema

Live data in Firebase RTDB is structured as:

```json
{
  "agroscare": {
    "probe_01": {
      "temperature":    "34°C",
      "humidity":       "72%",
      "soilMoisture":   "38%",
      "infestationRisk":"ELEVATED",
      "timestamp":      "2025-06-01T08:32:11Z"
    }
  }
}
```

---

## Pin Configuration

### Transmitter — Arduino Uno

| Connection | Pin |
|---|---|
| DHT11 Data | Pin 8 |
| Soil Moisture AO | A0 |
| LoRa SCK | Pin 13 |
| LoRa MISO | Pin 12 |
| LoRa MOSI | Pin 11 |
| LoRa NSS (CS) | Pin 10 |
| LoRa RST | Pin 9 |
| LoRa DIO0 | Pin 2 |

### FOG Node — ESP32

| Connection | Pin |
|---|---|
| LoRa SCK | GPIO 18 |
| LoRa MISO | GPIO 19 |
| LoRa MOSI | GPIO 23 |
| LoRa NSS (CS) | GPIO 5 |
| LoRa RST | GPIO 21 |
| LoRa DIO0 | GPIO 2 |

---

## Quickstart

### 1. Clone

```bash
git clone https://github.com/Srevarshan05/AgrosCare.git
cd AgrosCare
```

### 2. Install Arduino Libraries

| Library | Source |
|---|---|
| LoRa by Sandeep Mistry | Arduino Library Manager |
| DHT sensor library | Adafruit via Library Manager |
| Firebase ESP32 Client | [mobizt/Firebase-ESP-Client](https://github.com/mobizt/Firebase-ESP-Client) |
| HTTPClient | Pre-installed with ESP32 board |

### 3. Add ESP32 Board Support

In Arduino IDE → `File > Preferences` → Additional Board Manager URLs:

```
https://dl.espressif.com/dl/package_esp32_index.json
```

Then: `Tools > Board > Boards Manager` → search **ESP32** → install.

### 4. Flash Firmware

**Transmitter (Arduino Uno):**
```
Open: firmware/Arduino_Transmitter.ino
Upload → select board: Arduino Uno
```

**FOG Node (ESP32):** Update credentials in `firmware/ESP32_FOG_Node.ino`:

```cpp
#define WIFI_SSID       "YOUR_WIFI"
#define WIFI_PASSWORD   "YOUR_PASSWORD"
#define FIREBASE_HOST   "YOUR_FIREBASE_URL"
#define FIREBASE_AUTH   "YOUR_FIREBASE_KEY"
```

```
Upload → select board: ESP32 Dev Module
```

### 5. Verify

```
[Uno]   → Transmitting: T=34.0 H=72.0 M=38
[ESP32] → FOG node received. Running threshold check...
[ESP32] → ELEVATED risk detected. Uploading alert to Firebase...
[ESP32] → Firebase upload: OK
```

---

## Project Structure

```
AgrosCare/
│
├── firmware/
│   ├── Arduino_Transmitter.ino   # Sensor probe read + LoRa TX
│   └── ESP32_FOG_Node.ino        # FOG computing + LoRa RX + Firebase upload
│
├── dashboard/
│   └── index.html                # Real-time infestation alert dashboard
│
├── docs/
│   └── wiring_diagram.png        # Hardware connection reference
│
├── requirements.txt
└── README.md
```

---

## Roadmap

```
sre@agroscare:~$ cat roadmap.txt
```

```
[✓]  Multi-sensor probe — soil moisture, temperature, humidity
[✓]  LoRa long-range transmission — up to 10km, zero infrastructure
[✓]  FOG computing node — bridges internet-less field to cloud
[✓]  Firebase RTDB cloud sync — real-time structured telemetry
[✓]  Real-time infestation alert dashboard
[✓]  Top 8 nationally — NAF Uzhavu Hackathon @ IITM
[✓]  IIM product mentorship — commercialisation roadmap
[ ]  Infestation-specific sensor expansion (VOC / acoustic)
[ ]  ML model — classify infestation type from sensor signature
[ ]  Mobile push alert — WhatsApp / SMS to farmer's phone
[ ]  Multi-node probe mesh for large cotton estates
[ ]  Solar-powered weatherproof probe enclosure
[ ]  Offline-first FOG dashboard for zero-connectivity operation
```

---

## Scalability

This architecture is intentionally minimal — and that is the point.

The FOG node handles multiple LoRa sensor probes simultaneously. Scaling to a 100-acre cotton estate means adding more probe units, not rebuilding infrastructure. The cloud layer (Firebase) scales horizontally without any configuration change.

The same codebase deployed in a cotton field in Tamil Nadu works identically in Telangana or Maharashtra. The sensor probe calibration thresholds are the only region-specific parameter.

The IIM mentorship session specifically validated this: low BOM cost plus zero infrastructure dependency makes AgrosCare deployable at scale without subsidy dependency.

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=5D4037,A5D6A7&height=120&section=footer&text=Built%20for%20cotton%20fields.%20Validated%20at%20IITM.%20Mentored%20by%20IIM.&fontSize=13&fontColor=ffffff&fontAlignY=65" width="100%"/>

**[Sre Varshan](https://github.com/Srevarshan05)** · AI/ML Engineer · SRM Trichy · 2027

</div>
