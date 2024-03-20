import * as puppeteer from "puppeteer";
import 'expect-puppeteer';
import { toMatchImageSnapshot } from 'jest-image-snapshot'
expect.extend({ toMatchImageSnapshot })

const URL = process.env.url || "https://cfos.dev.metacell.us/";
const TIMEOUT = 60000;


//SNAPSHOT:
const SNAPSHOT_OPTIONS = {
    customSnapshotsDir: `./tests/snapshots/Viewer.test/`,
    comparisonMethod: 'ssim',
    failureThresholdType: 'percent',
    failureThreshold: 0.10
};


jest.setTimeout(300000);
let viewer_test_browser: any;
let viewer_test_page: any;

declare global {
    namespace jest {
        interface Matchers<R> {
            toMatchImageSnapshot(options?: import('jest-image-snapshot').MatchImageSnapshotOptions): R;
        }
    }
}

describe('Viewer Test', () => {


    beforeAll(async () => {
        viewer_test_browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox', "--ignore-certificate-errors"],
            headless: true,
            devtools: false,
            defaultViewport: {
                width: 1600,
                height: 1000,
            },
        });
        viewer_test_page = await viewer_test_browser.newPage();
    });

    afterAll(async () => {
        await viewer_test_browser.close();
    });

    test('Load the page', async () => {
        console.log('Loading the page ...')

        await viewer_test_page.goto(URL);
        await viewer_test_page.waitForSelector('.jss3', { timeout: TIMEOUT, hidden: false });
        console.log(viewer_test_page.url());
        await viewer_test_page.waitForSelector('#geppetto-menu-btn', { timeout: TIMEOUT, hidden: false });

        await viewer_test_page.waitForSelector('.MuiBox-root > h6.MuiTypography-root.MuiTypography-h6', { timeout: TIMEOUT, hidden: false });

        const selector = '.MuiBox-root > h6.MuiTypography-root.MuiTypography-h6';

        await viewer_test_page.waitForFunction(
            (selector, text) => document.querySelector(selector).innerText === text,
            { timeout: TIMEOUT * 3 },
            selector,
            'Fetching atlas...'
        );

        await viewer_test_page.waitForFunction(
            (selector, text) => document.querySelector(selector).innerText !== text,
            { timeout: TIMEOUT * 5 },
            selector,
            'Fetching atlas...'
        );

        const element = await viewer_test_page.$('canvas');
        const screenshot = await element.screenshot();
        await viewer_test_page.waitForTimeout(3000)
        expect(screenshot).toMatchImageSnapshot({
            ...SNAPSHOT_OPTIONS,
            customSnapshotIdentifier: 'MDMA Map'
        });
        console.log('Page Loaded')

    });

    test('Move to Previous Slices', async () => {
        console.log('Moving to Previous Slices ...')
        await viewer_test_page.waitForSelector('button[aria-label="Previous slice"]', { timeout: TIMEOUT, hidden: false });
        for (let i = 0; i < 50; i++) {
            await viewer_test_page.click('button[aria-label="Previous slice"]');
            await viewer_test_page.waitForTimeout(500)

        }
        // const element = await viewer_test_page.$('canvas');
        const screenshot = await viewer_test_page.screenshot();
        await viewer_test_page.waitForTimeout(3000)
        expect(screenshot).toMatchImageSnapshot({
            ...SNAPSHOT_OPTIONS,
            customSnapshotIdentifier: 'MDMA: Previous Slices'
        });
        console.log('Moved to Previous Slices ')

    });

    test('Center Stack', async () => {
        console.log('Centering Stack ...')
        await viewer_test_page.waitForSelector('button[aria-label="Center stack"]', { timeout: TIMEOUT, hidden: false });
        await viewer_test_page.click('button[aria-label="Center stack"]');

        // const element = await viewer_test_page.$('canvas');
        const screenshot = await viewer_test_page.screenshot();
        await viewer_test_page.waitForTimeout(3000)
        expect(screenshot).toMatchImageSnapshot({
            ...SNAPSHOT_OPTIONS,
            customSnapshotIdentifier: 'MDMA Map Centered'
        });
        console.log('Centered Stack')
    })

    test('Move to Next Slices', async () => {
        console.log('Moving to Next Slices ...')
        await viewer_test_page.waitForSelector('button[aria-label="Next slice"]', { timeout: TIMEOUT, hidden: false });
        for (let i = 0; i < 50; i++) {
            await viewer_test_page.click('button[aria-label="Next slice"]');
            await viewer_test_page.waitForTimeout(500)
        }
        // const element = await viewer_test_page.$('canvas');
        const screenshot = await viewer_test_page.screenshot();
        await viewer_test_page.waitForTimeout(300)
        expect(screenshot).toMatchImageSnapshot({
            ...SNAPSHOT_OPTIONS,
            customSnapshotIdentifier: 'MDMA: Next Slices'
        });
        console.log('Moved to Next Slices')
    })

    test('Toggle Wireframe', async () => {
        console.log('Toggling Wireframe ...')
        await viewer_test_page.waitForSelector('button[aria-label="Switch to wireframe"]', { timeout: TIMEOUT, hidden: false });
        await viewer_test_page.click('button[aria-label="Switch to wireframe"]');
        await viewer_test_page.waitForTimeout(500)
        await viewer_test_page.waitForSelector('button[aria-label="Next slice"]', { timeout: TIMEOUT, hidden: false });
        await viewer_test_page.click('button[aria-label="Next slice"]');
        await viewer_test_page.waitForTimeout(500)
        await viewer_test_page.waitForSelector('button[aria-label="Previous slice"]', { timeout: TIMEOUT, hidden: false });
        await viewer_test_page.click('button[aria-label="Previous slice"]');
        await viewer_test_page.waitForTimeout(500)
        await viewer_test_page.waitForSelector('button[aria-label="Center stack"]', { timeout: TIMEOUT, hidden: false });
        await viewer_test_page.click('button[aria-label="Center stack"]');
        await viewer_test_page.waitForTimeout(500)
        
        // const element = await viewer_test_page.$('canvas');
        const screenshot = await viewer_test_page.screenshot();
        await viewer_test_page.waitForTimeout(300)
        expect(screenshot).toMatchImageSnapshot({
            ...SNAPSHOT_OPTIONS,
            customSnapshotIdentifier: 'MDMA: Wireframe'
        });
        console.log('Toggled Wireframe')
    })



});