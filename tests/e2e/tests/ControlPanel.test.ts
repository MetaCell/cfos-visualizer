import * as puppeteer from "puppeteer";
import 'expect-puppeteer';
import { toMatchImageSnapshot } from 'jest-image-snapshot'
expect.extend({ toMatchImageSnapshot })
const fs = require('fs');
const path = require('path');

const URL = process.env.APP_URL || "https://cfos.dev.metacell.us/";
const TIMEOUT = 60000;


//SNAPSHOT:
const SNAPSHOT_OPTIONS = {
    customSnapshotsDir: `./tests/snapshots/ControlPanel.test/`,
    comparisonMethod: 'ssim',
    failureThresholdType: 'percent',
    failureThreshold: 0.10
};


jest.setTimeout(300000);
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
        expect(textContent).toBe('MDMA (social context) maps');

        const element = await cp_test_page.$('canvas');
        const screenshot = await element.screenshot();

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
        const element = await cp_test_page.$('canvas');
        const screenshot = await element.screenshot();

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
        const element = await cp_test_page.$('canvas');
        const screenshot = await element.screenshot();

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
        await cp_test_page.waitForTimeout(3000);
    
        // Get the list of files in the download path
        const filesInDownloadPath = fs.readdirSync(downloadPath);
    
        // Assuming only one file is downloaded, you can capture it directly
        if (filesInDownloadPath.length > 0) {
            const downloadedFileName = filesInDownloadPath[0];
            console.log(`Downloaded file: ${downloadedFileName}`);
            expect(downloadedFileName).toContain('gubra_ano_combined_25um.nii.gz');
        } else {
            console.log('No files found in the download path.');
            throw new Error('No files found in the download path.');
        }
    });
    



});