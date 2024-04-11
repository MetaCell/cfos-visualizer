import * as puppeteer from "puppeteer";
import 'expect-puppeteer';
import { toMatchImageSnapshot } from 'jest-image-snapshot'
expect.extend({ toMatchImageSnapshot })
const fs = require('fs');
const path = require('path');

const URL = process.env.url || "https://cfos.dev.metacell.us/";
const TIMEOUT = 60000;


//SNAPSHOT:
const SNAPSHOT_OPTIONS = {
    customSnapshotsDir: `./tests/snapshots/ControlPanel.test/`,
    comparisonMethod: 'ssim',
    failureThresholdType: 'percent',
    failureThreshold: 0.10
};


jest.setTimeout(400000);
let cp_test_browser: any;
let cp_test_page: any;

declare global {
    namespace jest {
        interface Matchers<R> {
            toMatchImageSnapshot(options?: import('jest-image-snapshot').MatchImageSnapshotOptions): R;
        }
    }
}

describe('Control Panel Test', () => {


    beforeAll(async () => {
        cp_test_browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox', "--ignore-certificate-errors"],
            headless: true,
            devtools: false,
            defaultViewport: {
                width: 1600,
                height: 1000,
            },
        });
        cp_test_page = await cp_test_browser.newPage();
    });

    afterAll(async () => {
        await cp_test_browser.close();
    });

    test('Load the page', async () => {
        console.log('Loading the page ...')

        await cp_test_page.goto(URL);
        await cp_test_page.waitForSelector('.jss3', { timeout: TIMEOUT, hidden: false });
        console.log(cp_test_page.url());
        await cp_test_page.waitForSelector('#geppetto-menu-btn', { timeout: TIMEOUT, hidden: false });

        await cp_test_page.waitForSelector('.MuiBox-root > h6.MuiTypography-root.MuiTypography-h6', { timeout: TIMEOUT, hidden: false });

        const selector = '.MuiBox-root > h6.MuiTypography-root.MuiTypography-h6';

        await cp_test_page.waitForFunction(
            (selector, text) => document.querySelector(selector).innerText === text,
            { timeout: TIMEOUT * 3 },
            selector,
            'Fetching atlas...'
        );

        await cp_test_page.waitForFunction(
            (selector, text) => document.querySelector(selector).innerText !== text,
            { timeout: TIMEOUT * 5 },
            selector,
            'Fetching atlas...'
        );

        await cp_test_page.waitForSelector('#geppetto-menu-btn', { timeout: TIMEOUT, hidden: false });
        const textContent = await cp_test_page.$eval('#geppetto-menu-btn', el => el.textContent);
        expect(textContent).toBe('Atlas images');

        // const element = await cp_test_page.$('canvas');
        const screenshot = await cp_test_page.screenshot();

        expect(screenshot).toMatchImageSnapshot({
            ...SNAPSHOT_OPTIONS,
            customSnapshotIdentifier: 'Atlas Map'
        });

        console.log('Page Loaded')
    });

    test('Control Panel: Hide', async () => {
        console.log('Hiding the Atlas Map ...')
        await cp_test_page.waitForSelector('button[aria-label="Hide"]', { timeout: TIMEOUT, hidden: false });
        await cp_test_page.click('button[aria-label="Hide"]');
        // const element = await cp_test_page.$('canvas');
        const screenshot = await cp_test_page.screenshot();

        expect(screenshot).toMatchImageSnapshot({
            ...SNAPSHOT_OPTIONS,
            customSnapshotIdentifier: 'Hidden Atlas Map'
        });


        console.log('Atlas Map Hidden')

    })

    test('Control Panel: Show', async () => {
        console.log('Displaying the Atlas Map ...')
        await cp_test_page.waitForSelector('button[aria-label="Show"]', { timeout: TIMEOUT, hidden: false });
        await cp_test_page.click('button[aria-label="Show"]');
        // const element = await cp_test_page.$('canvas');
        const screenshot = await cp_test_page.screenshot();

        expect(screenshot).toMatchImageSnapshot({
            ...SNAPSHOT_OPTIONS,
            customSnapshotIdentifier: 'Displayed Atlas Map'
        });
        console.log('Atlas Map Displayed')
    })

    test('Control Panel: Download', async () => {
        console.log('Downloading the Atlas Map ...');
        const downloadPath = path.resolve(__dirname, 'downloads');

        // Set the download behavior
        await cp_test_page._client.send('Page.setDownloadBehavior', {
            behavior: 'allow',
            downloadPath: downloadPath,
        });

        // Click the 'Download' button
        await cp_test_page.waitForSelector('button[aria-label="Download"]', { timeout: TIMEOUT, hidden: false });
        await cp_test_page.click('button[aria-label="Download"]');
        await cp_test_page.click('button[aria-label="Download"]');

        // Wait for the download request to complete
        const response = await cp_test_page.waitForResponse(
            response => response.url().includes('gubra_ano_combined_25um'),
            { timeout: 6000 } 
        );
        // Check if the response status is OK
        expect(response.ok()).toBeTruthy();

        console.log('Download initiated');

    });




});