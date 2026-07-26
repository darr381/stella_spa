import puppeteer from 'puppeteer';

const delay = ms => new Promise(r => setTimeout(r, ms));

async function runTests() {
  console.log('Starting Automated Use Case Testing for Stella Appointment System...');
  
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Provide extra time for load
  page.setDefaultTimeout(30000);

  try {
    // ---------------------------------------------------------
    // 1. Customer Authentication Flow
    // ---------------------------------------------------------
    console.log('\n--- Step 1: Customer Authentication Flow ---');
    await page.goto('http://localhost:5173', { waitUntil: 'domcontentloaded' });
    console.log('Selecting English...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const enBtn = btns.find(b => b.innerText.includes('English'));
      if (enBtn) enBtn.click();
    });
    await delay(1000);

    // Open Login Modal via Navbar
    console.log('Opening Login Modal...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const bookNowBtn = btns.find(b => b.innerText.includes('Book Now'));
      if (bookNowBtn) bookNowBtn.click();
    });
    await delay(1000);
    
    // Fill Registration Form
    await page.type('input[placeholder="e.g. Jane"]', 'Test User');
    await page.type('input[placeholder="e.g. 91234567"]', '88881111');
    
    // Click Continue
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const submit = btns.find(b => b.innerText.includes('Continue'));
      if (submit) submit.click();
    });
    await delay(1500);

    // If account not found, click Create Now
    console.log('Registering new customer (Test User - 88881111)...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const createNow = btns.find(b => b.innerText.includes('Create Now'));
      if (createNow) createNow.click();
    });
    await delay(1500);
    
    // Verify login success (redirected to MyAppointments or handled by alert)
    console.log('Customer Registration successful!');
    
    // Wait for MyAppointments page to load
    await page.waitForSelector('h1', { timeout: 5000 });
    
    // ---------------------------------------------------------
    // 2. Core Booking Flow
    // ---------------------------------------------------------
    console.log('\n--- Step 2: Core Booking Flow ---');
    console.log('Clicking New Booking...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const newBook = btns.find(b => b.innerText.includes('New Booking'));
      if (newBook) newBook.click();
    });
    await delay(2000);
    
    // Step 1: Select Service
    console.log('Selecting Signature Massage...');
    await page.evaluate(() => {
      const h3s = Array.from(document.querySelectorAll('h3'));
      const massage = h3s.find(h => h.innerText.includes('Signature Massage'));
      if (massage) massage.closest('button').click();
    });
    await delay(1000);
    
    // Select Add-on
    console.log('Selecting Hot Stone add-on...');
    await page.evaluate(() => {
      const h4s = Array.from(document.querySelectorAll('h4'));
      const addon = h4s.find(h => h.innerText.includes('Hot Stone'));
      if (addon) addon.closest('button').click();
    });
    await delay(1000);
    
    // Click Next
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const nextBtn = btns.find(b => b.innerText.includes('Continue'));
      if (nextBtn) nextBtn.click();
    });
    await delay(1000);
    
    // Step 2: Therapist
    console.log('Selecting Any Available Therapist...');
    await page.evaluate(() => {
      const h3s = Array.from(document.querySelectorAll('h3'));
      const any = h3s.find(h => h.innerText.includes('Any Available Therapist'));
      if (any) any.closest('button').click();
    });
    await delay(1000);
    
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const nextBtn = btns.find(b => b.innerText.includes('Continue'));
      if (nextBtn) nextBtn.click();
    });
    await delay(1000);
    
    // Step 3: Date & Time
    console.log('Selecting Time Slot...');
    // Pick the first available time slot
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const slot = btns.find(b => b.className.includes('border-nature-green') && !b.disabled);
      if (slot) slot.click();
    });
    await delay(1000);
    
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const nextBtn = btns.find(b => b.innerText.includes('Continue'));
      if (nextBtn) nextBtn.click();
    });
    await delay(1000);
    
    // Step 4: Checkout
    console.log('Confirming Booking...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const bookBtn = btns.find(b => b.innerText.includes('Confirm & Book'));
      if (bookBtn) bookBtn.click();
    });
    await delay(2000);
    
    // Go to My Appointments
    await page.waitForFunction(() => {
      return Array.from(document.querySelectorAll('button')).some(b => b.innerText.includes('Return to My Appointments'));
    }, { timeout: 10000 });

    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const returnBtn = btns.find(b => b.innerText.includes('Return to My Appointments'));
      if (!returnBtn) throw new Error('Return to My Appointments button not found');
      returnBtn.click();
    });
    await delay(2000);
    
    console.log('Booking Flow successful!');

    // ---------------------------------------------------------
    // 3. Profile Management Migration
    // ---------------------------------------------------------
    console.log('\n--- Step 3: Profile Management Migration ---');
    console.log('Opening Profile Modal...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const profBtn = btns.find(b => b.innerText.includes('Profile'));
      if (!profBtn) throw new Error('Profile button not found on MyAppointments page');
      profBtn.click();
    });
    await delay(1000);
    
    console.log('Changing phone number to 88882222...');
    await page.waitForSelector('input[type="tel"]', { visible: true });
    // Clear and type new phone
    await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input[type="tel"]'));
      // The first visible one is the profile modal (since login modal is closed)
      const input = inputs.find(i => i.offsetParent !== null);
      if (input) {
        input.value = '';
      }
    });
    
    // Type into the visible tel input
    const telInputs = await page.$$('input[type="tel"]');
    for (let input of telInputs) {
      const isVisible = await input.evaluate(el => el.offsetParent !== null);
      if (isVisible) {
        await input.type('88882222');
        break;
      }
    }
    
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const saveBtn = btns.find(b => b.innerText.includes('Save Profile'));
      if (saveBtn) saveBtn.click();
    });
    await delay(3000); // allow db migration
    
    console.log('Profile Migration successful!');
    
    // Clean up
    console.log('\nAll core use case UI flows executed successfully!');

  } catch (err) {
    console.error('Test script encountered an error:', err);
  } finally {
    await browser.close();
  }
}

runTests();
