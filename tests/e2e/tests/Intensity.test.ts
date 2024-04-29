import * as puppeteer from "puppeteer";
import 'expect-puppeteer';
import { toMatchImageSnapshot } from 'jest-image-snapshot'
expect.extend({ toMatchImageSnapshot })

const URL = process.env.url || "https://cfos.dev.metacell.us/";
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
            headless: false,
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
        console.log(intensity_test_page.url());
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
        expect(textContent).toBe('Atlas images');

        const screenshot = await intensity_test_page.screenshot();

        expect(screenshot).toMatchImageSnapshot({
            ...SNAPSHOT_OPTIONS,
            customSnapshotIdentifier: 'Atlas Map'
        });

        console.log('Page loaded')

    });

    test('Add Statistical Map', async () => {
        await intensity_test_page.waitForSelector('.MuiButtonBase-root.MuiButton-root.MuiButton-contained.MuiButton-containedPrimary.MuiButton-sizeMedium.MuiButton-containedSizeMedium.MuiButton-colorPrimary.MuiButton-root.MuiButton-contained.MuiButton-containedPrimary.MuiButton-sizeMedium.MuiButton-containedSizeMedium.MuiButton-colorPrimary', { timeout: TIMEOUT, hidden: false });
        await intensity_test_page.click('.MuiButtonBase-root.MuiButton-root.MuiButton-contained.MuiButton-containedPrimary.MuiButton-sizeMedium.MuiButton-containedSizeMedium.MuiButton-colorPrimary.MuiButton-root.MuiButton-contained.MuiButton-containedPrimary.MuiButton-sizeMedium.MuiButton-containedSizeMedium.MuiButton-colorPrimary');
        await intensity_test_page.waitForSelector('.MuiFormGroup-root', { timeout: TIMEOUT, hidden: false });
        await intensity_test_page.waitForSelector('.MuiFormGroup-root > .MuiBox-root', { timeout: TIMEOUT, hidden: false });
        await intensity_test_page.click('.MuiFormGroup-root > .MuiBox-root');

        const selector = '.MuiBox-root > h6.MuiTypography-root.MuiTypography-h6';

        await intensity_test_page.waitForFunction(
            (selector, text) => document.querySelector(selector).innerText === text,
            { timeout: TIMEOUT * 3 },
            selector,
            'Fetching activity map...'
        );

        await intensity_test_page.waitForFunction(
            (selector, text) => document.querySelector(selector).innerText !== text,
            { timeout: TIMEOUT * 3 },
            selector,
            'Fetching acitivy map...'
        );
        const global_intensity_text_selector = 'p.MuiTypography-root.MuiTypography-body2'
        await intensity_test_page.waitForFunction(
            (selector, text) => document.querySelector(selector).innerText == text,
            { timeout: TIMEOUT * 5 },
            global_intensity_text_selector,
            'Global intensity'
        );
        
    })

    test('Change Global Intensity', async () => {
        console.log('Changing Global Intensity ...')

        await intensity_test_page.waitForSelector('.MuiSlider-root.MuiSlider-colorPrimary.MuiSlider-sizeMedium', { timeout: TIMEOUT, hidden: false });
        const selector = '.MuiSlider-root.MuiSlider-colorPrimary.MuiSlider-sizeMedium';

        await intensity_test_page.waitForFunction(
            (selector) => document.querySelectorAll(selector).length === 3,
            { timeout: TIMEOUT },
            selector
        );

        await intensity_test_page.waitForSelector('.MuiSlider-root.MuiSlider-colorPrimary.MuiSlider-sizeMedium .MuiSlider-thumb.MuiSlider-thumbSizeMedium.MuiSlider-thumbColorPrimary.MuiSlider-thumb.MuiSlider-thumbSizeMedium.MuiSlider-thumbColorPrimary', { timeout: TIMEOUT, hidden: false });

        const sliders = await intensity_test_page.$$('.MuiSlider-root.MuiSlider-colorPrimary.MuiSlider-sizeMedium .MuiSlider-thumb.MuiSlider-thumbSizeMedium.MuiSlider-thumbColorPrimary.MuiSlider-thumb.MuiSlider-thumbSizeMedium.MuiSlider-thumbColorPrimary');
        if (sliders.length > 1) {
            const sliderBox = await sliders[1].boundingBox(); // Get the bounding box of the second slider
            const sliderStartX = sliderBox.x // + sliderBox.width / 2;
            const sliderY = sliderBox.y  //+ sliderBox.height / 2;

            // Drag the second slider a bit to the left
            await intensity_test_page.mouse.move(sliderStartX, sliderY);
            await intensity_test_page.mouse.down();
            await intensity_test_page.mouse.move(sliderStartX - 40, sliderY); 
            await intensity_test_page.mouse.up();
        }

        await intensity_test_page.waitForTimeout('3000');
        // await intensity_test_page.waitForSelector('#viewer > div.MuiBox-root > div.MuiBox-root > div.MuiBox-root', { timeout: TIMEOUT, hidden: false });
        // const bar_elements = await intensity_test_page.$$('#viewer > div.MuiBox-root > div.MuiBox-root > div.MuiBox-root');
        // await bar_elements[1].click();

        const screenshot = await intensity_test_page.screenshot();
        expect(screenshot).toMatchImageSnapshot({
            ...SNAPSHOT_OPTIONS,
            customSnapshotIdentifier: 'Changed Intensity'
        });

    })

    test('Reset Global Intensity', async () => {

        console.log('Resetting Global Intensity ...')

        const selector = '#viewer .MuiButtonBase-root.MuiButton-root.MuiButton-text.MuiButton-textPrimary.MuiButton-sizeMedium.MuiButton-textSizeMedium.MuiButton-root.MuiButton-text.MuiButton-textPrimary.MuiButton-sizeMedium.MuiButton-textSizeMedium';
        await intensity_test_page.waitForSelector(selector, { timeout: TIMEOUT, hidden: false });

        const elements = await intensity_test_page.$$(selector);

        expect(elements.length).toBe(3);
        await elements[0].click();

        await intensity_test_page.waitForTimeout(3000);
        const screenshot = await intensity_test_page.screenshot();
        expect(screenshot).toMatchImageSnapshot({
            ...SNAPSHOT_OPTIONS,
            customSnapshotIdentifier: 'Reset Intensity'
        });
        await intensity_test_page.waitForTimeout(3000);


        console.log('Global Intensity reset')
    });


    test('Change individual Intensity', async () => {

        console.log('Changing individual Intensity ...')
        // await intensity_test_page.waitForSelector('#viewer > div.MuiBox-root > div.MuiBox-root > div.MuiBox-root', { timeout: TIMEOUT, hidden: false });
        // const bar_elements = await intensity_test_page.$$('#viewer > div.MuiBox-root > div.MuiBox-root > div.MuiBox-root');
        // await bar_elements[1].click();

        await intensity_test_page.waitForSelector('.MuiSlider-root.MuiSlider-colorPrimary.MuiSlider-sizeMedium', { timeout: TIMEOUT, hidden: false });
        const selector = '.MuiSlider-root.MuiSlider-colorPrimary.MuiSlider-sizeMedium';
        await intensity_test_page.waitForFunction(
            (selector) => document.querySelectorAll(selector).length === 3,
            { timeout: TIMEOUT },
            selector
        );

        await intensity_test_page.waitForSelector('.MuiSlider-root.MuiSlider-colorPrimary.MuiSlider-sizeMedium .MuiSlider-thumb.MuiSlider-thumbSizeMedium.MuiSlider-thumbColorPrimary.MuiSlider-thumb.MuiSlider-thumbSizeMedium.MuiSlider-thumbColorPrimary', { timeout: TIMEOUT, hidden: false });

        const sliders = await intensity_test_page.$$('.MuiSlider-root.MuiSlider-colorPrimary.MuiSlider-sizeMedium .MuiSlider-thumb.MuiSlider-thumbSizeMedium.MuiSlider-thumbColorPrimary.MuiSlider-thumb.MuiSlider-thumbSizeMedium.MuiSlider-thumbColorPrimary');
        if (sliders.length > 1) {
            const sliderBox = await sliders[3].boundingBox(); 
            const sliderStartX = sliderBox.x // + sliderBox.width / 2;
            const sliderY = sliderBox.y  //+ sliderBox.height / 2;

            // Drag the second slider a bit to the left
            await intensity_test_page.mouse.move(sliderStartX, sliderY);
            await intensity_test_page.mouse.down();
            await intensity_test_page.mouse.move(sliderStartX - 5, sliderY); 
            await intensity_test_page.mouse.up();
        }

        await intensity_test_page.waitForTimeout('3000');
        const screenshot = await intensity_test_page.screenshot();
        expect(screenshot).toMatchImageSnapshot({
            ...SNAPSHOT_OPTIONS,
            customSnapshotIdentifier: 'Changed Individual Intensity'
        });
        console.log('Individual Intensity changed')
    });

    test.skip('Reset individual Intensity', async () => {
        console.log('Resetting individual Intensity ...')
       

        console.log('Individual Intensity reset')

    });





});