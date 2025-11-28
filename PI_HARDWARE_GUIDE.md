# Raspberry Pi Hardware Guide for Wedding Captive Portal

## Which Pi Should You Use?

All these models work with the captive portal setup:

### ✅ **Pi Zero W** - Budget Option
- **Price:** ~$15
- **Pros:** Tiny, cheap, low power consumption
- **Cons:** Slower CPU, less RAM
- **Best for:** 20-50 guests, smaller venues
- **Performance:** Works well for static website, may be slow with 50+ simultaneous connections
- **Power:** Can run 12+ hours on 10,000mAh battery

### ✅✅ **Pi Zero 2 W** - Recommended Budget Option
- **Price:** ~$15
- **Pros:** 5x faster than Pi Zero W, still tiny and cheap
- **Cons:** Still limited RAM (512MB)
- **Best for:** 50-80 guests, medium venues
- **Performance:** Handles most wedding scenarios easily
- **Power:** Can run 10+ hours on 10,000mAh battery

### ✅✅✅ **Pi 4 (2GB or 4GB)** - Recommended
- **Price:** ~$35-45
- **Pros:** Fast, reliable, plenty of RAM
- **Cons:** More expensive, larger size
- **Best for:** 100+ guests, any venue size
- **Performance:** Handles large weddings with ease
- **Power:** Runs 6-8 hours on 20,000mAh battery

### ✅✅✅ **Pi 5** - Overkill (but great)
- **Price:** ~$60-80
- **Pros:** Most powerful, fastest WiFi
- **Cons:** Most expensive, higher power consumption
- **Best for:** 150+ guests, large venues
- **Performance:** Overkill for a static website, but bulletproof
- **Power:** Runs 4-6 hours on 20,000mAh battery

## Performance Comparison

| Model | Concurrent Users | WiFi Range | Boot Time | Cost |
|-------|-----------------|------------|-----------|------|
| Pi Zero W | 20-40 | 30-40 ft | ~60s | $ |
| Pi Zero 2 W | 50-80 | 30-40 ft | ~40s | $ |
| Pi 4 | 100-150 | 40-50 ft | ~30s | $$ |
| Pi 5 | 200+ | 50+ ft | ~20s | $$$ |

## What You Need

### Minimum Requirements (Any Pi Model)

1. **Raspberry Pi** with WiFi:
   - Pi Zero W or Zero 2 W (has WiFi built-in) ✅
   - Pi 3 or newer (has WiFi built-in) ✅
   - Original Pi Zero (NO WiFi) ❌

2. **MicroSD Card:**
   - 8GB minimum
   - 16GB+ recommended
   - Class 10 or better

3. **Power Supply:**
   - **Pi Zero/Zero 2:** 5V 2A micro USB
   - **Pi 4:** 5V 3A USB-C
   - **Pi 5:** 5V 5A USB-C (or official 27W adapter)

4. **Optional - Battery Power:**
   - 10,000mAh power bank (Pi Zero - lasts 12+ hours)
   - 20,000mAh power bank (Pi 4/5 - lasts 6-8 hours)

### Setup Requirements

- Computer with SD card reader (for initial setup)
- Keyboard + Monitor (for first boot) OR
- Another computer for SSH access

## Recommendations by Wedding Size

### Small Wedding (< 50 guests)
**Recommended:** Pi Zero 2 W
- Cost-effective at ~$15
- More than enough power
- Battery lasts all day

### Medium Wedding (50-100 guests)
**Recommended:** Pi 4 (2GB)
- Reliable and fast
- Good WiFi range
- Handles concurrent connections well

### Large Wedding (100+ guests)
**Recommended:** Pi 4 (4GB) or Pi 5
- Maximum performance
- Best WiFi range
- No performance concerns

## What About WiFi Range?

All Pi models have similar WiFi range (~30-50 feet indoors).

**To extend range:**
1. **Position centrally** - Place Pi in middle of venue
2. **Elevate it** - Higher = better coverage
3. **Avoid obstacles** - Keep away from metal, thick walls
4. **Use 2 Pi's** - For large/outdoor venues, run 2 Pi's on different channels:
   - Pi #1: Channel 1, SSID "Wedding-Seating-1"
   - Pi #2: Channel 11, SSID "Wedding-Seating-2"

## Power Options

### Wall Power (Recommended)
- Most reliable
- No battery concerns
- Venue needs power outlet

### Battery Power
Great for outdoor venues or as backup:

**Pi Zero W/2W:**
- 10,000mAh = 12+ hours
- 20,000mAh = 24+ hours

**Pi 4:**
- 20,000mAh = 6-8 hours
- 30,000mAh = 10-12 hours

**Pi 5:**
- 20,000mAh = 4-6 hours
- 30,000mAh = 8-10 hours

**Tip:** Use a power bank with "always on" mode (doesn't shut off for low-power devices)

## Shopping List

### Budget Build (~$30)
- Raspberry Pi Zero 2 W: $15
- MicroSD 16GB: $8
- Micro USB cable: $5
- USB Power adapter: $5
- OR 10,000mAh power bank: $15

### Recommended Build (~$60)
- Raspberry Pi 4 (2GB): $35
- MicroSD 32GB: $10
- USB-C cable: $8
- Official power supply: $8
- OR 20,000mAh power bank: $25

### Premium Build (~$100)
- Raspberry Pi 5 (4GB): $60
- MicroSD 64GB: $12
- USB-C cable: $10
- Official 27W adapter: $12
- OR 30,000mAh power bank: $40

## My Recommendation

**For most weddings: Get a Pi Zero 2 W**

Why?
- ✅ Only $15
- ✅ Plenty of power for 50-80 guests
- ✅ Tiny and portable
- ✅ Runs all day on small battery
- ✅ Same setup process as Pi 5
- ✅ If it fails, you're only out $15

**Upgrade to Pi 4 if:**
- You have 80+ guests
- You want absolute reliability
- You want to reuse it for other projects later

**Skip Pi 5 unless:**
- You're hosting 150+ people
- Money is no concern
- You want the best of the best

## Where to Buy

### US Retailers
- **Adafruit** - adafruit.com (reliable, fast shipping)
- **SparkFun** - sparkfun.com
- **Amazon** - Quick delivery, slightly higher prices
- **Micro Center** - In-store pickup if near you

### Kits vs Individual Parts
- **Kits** (~$40-80): Include Pi + SD card + power supply + case
- **Individual parts**: More flexible, often cheaper

**CanaKit** and **Vilros** make good starter kits on Amazon.

## Testing Before the Wedding

**Test checklist:**
1. ✅ Set up Pi at least 1 week before
2. ✅ Test with 5-10 phones at once
3. ✅ Check WiFi range in your home
4. ✅ Test battery runtime if using battery power
5. ✅ Have backup power supply/battery
6. ✅ Print backup seating chart as ultimate fallback

## Common Questions

**Q: Can I use original Pi Zero (without W)?**
A: No - it doesn't have WiFi built-in. You need Pi Zero W or Zero 2 W.

**Q: What about Pi 3?**
A: Yes! Pi 3 works great. Similar performance to Pi 4 but older.

**Q: Do I need a case?**
A: Not required, but recommended to protect it. $5-10 on Amazon.

**Q: Can I reuse this Pi after the wedding?**
A: Absolutely! Just disable the services and use it for other projects.

**Q: What if my venue has spotty WiFi - will this help?**
A: This creates its own isolated WiFi network - doesn't need venue WiFi at all!

**Q: How many devices can connect?**
A: Pi Zero 2 W: ~50, Pi 4: ~100, Pi 5: 200+. For reference, not all guests connect simultaneously.

---

**Bottom line:** Pi Zero 2 W is the sweet spot for most weddings. Pi 4 if you want extra headroom. Pi 5 if money is no object.
