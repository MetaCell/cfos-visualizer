import * as puppeteer from "puppeteer";
import 'expect-puppeteer';
import { toMatchImageSnapshot } from 'jest-image-snapshot'
expect.extend({ toMatchImageSnapshot })

const URL = process.env.APP_URL || "https://cfos.dev.metacell.us/";
const TIMEOUT = 60000;


//SNAPSHOT:
const SNAPSHOT_OPTIONS = {
    customSnapshotsDir: `./tests/snapshots/Intensity.test/`,
    comparisonMethod: 'ssim',
    failureThresholdType: 'percent',
    failureThreshold: 0.10
};


jest.setTimeout(300000);
let inetensity_test_browser: any;
let intensity_test_page: any;

declare global {
    namespace jest {
        interface Matchers<R> {
            toMatchImageSnapshot(options?: import('jest-image-snapshot').MatchImageSnapshotOptions): R;
        }
    }
}

describe('Intensity Test', () => {


    beforeAll(async () => {
        inetensity_test_browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox', "--ignore-certificate-errors"],
            headless: true,
            devtools: false,
            defaultViewport: {
                width: 1600,
                height: 1000,
            },
        });
        intensity_test_page = await inetensity_test_browser.newPage();
    });

    afterAll(async () => {
        await inetensity_test_browser.close();
    });

    test('Load the page', async () => {
        console.log('Loading page ...')

        await intensity_test_page.goto(URL);
        await intensity_test_page.waitForSelector('.jss3', { timeout: TIMEOUT, hidden: false });
        await intensity_test_page.waitForSelector('#geppetto-menu-btn', { timeout: TIMEOUT, hidden: false });

        await intensity_test_page.waitForSelector('.MuiBox-root > h6.MuiTypography-root.MuiTypography-h6', { timeout: TIMEOUT, hidden: false });

        const selector = '.MuiBox-root > h6.MuiTypography-root.MuiTypography-h6';

        await intensity_test_page.waitForFunction(
            (selector, text) => document.querySelector(selector).innerText === text,
            { timeout: TIMEOUT * 3 },
            selector,
            'Fetching atlas...'
        );

        await intensity_test_page.waitForFunction(
            (selector, text) => document.querySelector(selector).innerText !== text,
            { timeout: TIMEOUT * 5 },
            selector,
            'Fetching atlas...'
        );

        await intensity_test_page.waitForSelector('#geppetto-menu-btn', { timeout: TIMEOUT, hidden: false });
        const textContent = await intensity_test_page.$eval('#geppetto-menu-btn', el => el.textContent);
        expect(textContent).toBe('MDMA (social context) maps');

        const element = await intensity_test_page.$('canvas');
        const screenshot = await element.screenshot();

        expect(screenshot).toMatchImageSnapshot({
            ...SNAPSHOT_OPTIONS,
            customSnapshotIdentifier: 'Atlas Map'
        });

        console.log('Page loaded')

    });

    test('Change Global Intensity', async () => {
        console.log('Changing Global Intensity ...')

        await intensity_test_page.waitForSelector('.MuiSlider-root.MuiSlider-colorPrimary.MuiSlider-sizeMedium', { timeout: TIMEOUT, hidden: false });
        const selector = '.MuiSlider-root.MuiSlider-colorPrimary.MuiSlider-sizeMedium';

        await intensity_test_page.waitForFunction(
            (selector) => document.querySelectorAll(selector).length === 2,
            { timeout: TIMEOUT },
            selector
        );

        // Get all sliders and select the first one
        const sliderElements = await intensity_test_page.$$(selector);
        const sliderElement1 = sliderElements[0];

        // Get the bounding box of the first slider
        const sliderBox1 = await sliderElement1.boundingBox();

        // Calculate the start and end points of the first slider
        const sliderStartX1 = sliderBox1.x + sliderBox1.width / 2;
        const sliderEndX1 = sliderBox1.x + sliderBox1.width;
        const sliderY1 = sliderBox1.y + sliderBox1.height / 2;
        const sliderMiddleX1 = sliderBox1.x + sliderBox1.width / 2; // Halfway point


        // Move the first slider to the max
        await intensity_test_page.mouse.move(sliderStartX1, sliderY1);
        await intensity_test_page.mouse.down();
        await intensity_test_page.mouse.move(sliderMiddleX1, sliderY1);
        await intensity_test_page.mouse.up();

        // Get the left style of all elements that match the selector
        const leftStyles = await intensity_test_page.$$eval('.MuiSlider-thumb.MuiSlider-thumbSizeMedium.MuiSlider-thumbColorPrimary.MuiSlider-thumb.MuiSlider-thumbSizeMedium.MuiSlider-thumbColorPrimary', (elements) => elements.map(element => element.style.left));

        // Check that the left style of both elements is '0%'
        leftStyles.forEach(leftStyle => {
            expect(leftStyle).toBe('50%');
        });

        console.log('Global Intensity changed')
    });

    test('Reset Global Intensity', async () => {

        console.log('Resetting Global Intensity ...')
        const selector = '.MuiButtonBase-root.MuiButton-root.MuiButton-text.MuiButton-textPrimary.MuiButton-sizeMedium.MuiButton-textSizeMedium.MuiButton-root.MuiButton-text.MuiButton-textPrimary.MuiButton-sizeMedium.MuiButton-textSizeMedium';

        await intensity_test_page.waitForSelector(selector, { timeout: TIMEOUT, hidden: false });

        const elements = await intensity_test_page.$$(selector);

        // Check that there are two elements
        expect(elements.length).toBe(2);
        await elements[0].click();
        await intensity_test_page.waitForTimeout(3000);

        await intensity_test_page.waitForSelector('.MuiSlider-thumb.MuiSlider-thumbSizeMedium.MuiSlider-thumbColorPrimary.MuiSlider-thumb.MuiSlider-thumbSizeMedium.MuiSlider-thumbColorPrimary', { timeout: TIMEOUT, hidden: false });


        // Get the left style of all elements that match the selector
        const leftStyles = await intensity_test_page.$$eval('.MuiSlider-thumb.MuiSlider-thumbSizeMedium.MuiSlider-thumbColorPrimary.MuiSlider-thumb.MuiSlider-thumbSizeMedium.MuiSlider-thumbColorPrimary', (elements) => elements.map(element => element.style.left));

        // Check that the left style of both elements is '0%'
        leftStyles.forEach(leftStyle => {
            expect(leftStyle).toBe('0%');
        });
        console.log('Global Intensity reset')
    });


    test('Change individual Intensity', async () => {

        console.log('Changing individual Intensity ...')
        await intensity_test_page.waitForSelector('.MuiSlider-root.MuiSlider-colorPrimary.MuiSlider-sizeMedium', { timeout: TIMEOUT, hidden: false });
        const selector = '.MuiSlider-root.MuiSlider-colorPrimary.MuiSlider-sizeMedium';

        await intensity_test_page.waitForFunction(
            (selector) => document.querySelectorAll(selector).length === 2,
            { timeout: TIMEOUT },
            selector
        );

        // Get all sliders and select the first one
        const sliderElements = await intensity_test_page.$$(selector);
        const sliderElement2 = sliderElements[1];

        // Get the bounding box of the first slider
        const sliderBox2 = await sliderElement2.boundingBox();

        // Calculate the start and end points of the first slider
        const sliderStartX2 = sliderBox2.x + sliderBox2.width / 2;
        const sliderEndX2 = sliderBox2.x + sliderBox2.width;
        const sliderY2 = sliderBox2.y + sliderBox2.height / 2;
        const sliderMiddleX2 = sliderBox2.x + sliderBox2.width / 2; // Halfway point


        await intensity_test_page.mouse.move(sliderStartX2, sliderY2);
        await intensity_test_page.mouse.down();
        await intensity_test_page.mouse.move(sliderMiddleX2, sliderY2);
        await intensity_test_page.mouse.up();

        // Get the left style of all elements that match the selector
        const leftStyles = await intensity_test_page.$$eval('.MuiSlider-thumb.MuiSlider-thumbSizeMedium.MuiSlider-thumbColorPrimary.MuiSlider-thumb.MuiSlider-thumbSizeMedium.MuiSlider-thumbColorPrimary', (elements) => elements.map(element => element.style.left));

        // Check that the left style of the first element is '0%'
        expect(leftStyles[0]).toBe('0%');

        // Check that the left style of the second element is '50%'
        expect(leftStyles[1]).toBe('50%');
        console.log('Individual Intensity changed')
    });

    test('Reset individual Intensity', async () => {
        console.log('Resetting individual Intensity ...')
        const selector = '.MuiButtonBase-root.MuiButton-root.MuiButton-text.MuiButton-textPrimary.MuiButton-sizeMedium.MuiButton-textSizeMedium.MuiButton-root.MuiButton-text.MuiButton-textPrimary.MuiButton-sizeMedium.MuiButton-textSizeMedium';

        await intensity_test_page.waitForSelector(selector, { timeout: TIMEOUT, hidden: false });

        const elements = await intensity_test_page.$$(selector);

        // Check that there are two elements
        expect(elements.length).toBe(2);
        await elements[1].click();
        await intensity_test_page.waitForTimeout(3000);

        await intensity_test_page.waitForSelector('.MuiSlider-thumb.MuiSlider-thumbSizeMedium.MuiSlider-thumbColorPrimary.MuiSlider-thumb.MuiSlider-thumbSizeMedium.MuiSlider-thumbColorPrimary', { timeout: TIMEOUT, hidden: false });

        const leftStyles = await intensity_test_page.$$eval('.MuiSlider-thumb.MuiSlider-thumbSizeMedium.MuiSlider-thumbColorPrimary.MuiSlider-thumb.MuiSlider-thumbSizeMedium.MuiSlider-thumbColorPrimary', (elements) => elements.map(element => element.style.left));

        expect(leftStyles[0]).toBe('0%');

        expect(leftStyles[1]).toBe('0%');

        console.log('Individual Intensity reset')

    });





});