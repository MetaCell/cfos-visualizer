import * as puppeteer from "puppeteer";
import 'expect-puppeteer';
import { toMatchImageSnapshot } from 'jest-image-snapshot'
expect.extend({ toMatchImageSnapshot })

const URL = process.env.APP_URL || "https://cfos.dev.metacell.us/";
const TIMEOUT = 60000; 


//SNAPSHOT:
const SNAPSHOT_OPTIONS = {
    customSnapshotsDir: `./tests/snapshots/SocialContextMap.test/`,
    comparisonMethod: 'ssim',
    failureThresholdType: 'percent',
    failureThreshold: 0.10
};


jest.setTimeout(300000);
let scm_test_browser: any;
let scm_test_page: any;

declare global {
    namespace jest {
      interface Matchers<R> {
        toMatchImageSnapshot(options?: import('jest-image-snapshot').MatchImageSnapshotOptions): R;
      }
    }
  }

describe('Social Context Map Test', () => {
   

    beforeAll(async () => {
        scm_test_browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox', "--ignore-certificate-errors"],
            headless: true,
            devtools: false,
            defaultViewport: {
                width: 1600,
                height: 1000,
            },
        });
        scm_test_page = await scm_test_browser.newPage();
    });

    afterAll(async () => {
        await scm_test_browser.close();
    });

    test('Load the page', async () => {
       console.log('Loading page ...')
        await scm_test_page.goto(URL);
        await scm_test_page.waitForSelector('.jss3', { timeout: TIMEOUT, hidden: false});
        await scm_test_page.waitForSelector('#geppetto-menu-btn', { timeout: TIMEOUT, hidden: false});

        await scm_test_page.waitForSelector('.MuiBox-root > h6.MuiTypography-root.MuiTypography-h6', { timeout: TIMEOUT, hidden: false});

        const selector = '.MuiBox-root > h6.MuiTypography-root.MuiTypography-h6';

        await scm_test_page.waitForFunction(
            (selector, text) => document.querySelector(selector).innerText === text,
            { timeout: TIMEOUT * 3 },
            selector,
            'Fetching atlas...'
        );

        await scm_test_page.waitForFunction(
            (selector, text) => document.querySelector(selector).innerText !== text,
            { timeout: TIMEOUT * 5 },
            selector,
            'Fetching atlas...'
        );

        await scm_test_page.waitForSelector('#geppetto-menu-btn', { timeout: TIMEOUT, hidden: false});
        const textContent = await scm_test_page.$eval('#geppetto-menu-btn', el => el.textContent);
        expect(textContent).toBe('MDMA (social context) maps');

        const element = await scm_test_page.$('canvas'); 
        const screenshot = await element.screenshot();
        
        expect(screenshot).toMatchImageSnapshot({
          ...SNAPSHOT_OPTIONS,
          customSnapshotIdentifier: 'Atlas Map'
        });
        
        console.log('Page Loaded')
    });

    test('Change Social Context Map', async () => {

        console.log('Changing Social Context Map ...');
        await scm_test_page.waitForSelector('#geppetto-menu-btn', { timeout: TIMEOUT, hidden: false});
        await scm_test_page.click('#geppetto-menu-btn');
        await scm_test_page.waitForSelector('li[id = "MDMA (social context) maps"]', { timeout: TIMEOUT, hidden: false});
        await scm_test_page.waitForSelector('li[id = "Psilocybin (HC; EE) maps"]', { timeout: TIMEOUT, hidden: false});
        await scm_test_page.waitForSelector('li[id = "Ketamine v. Naltrexone+Ket maps"]', { timeout: TIMEOUT, hidden: false});

        await scm_test_page.hover('li[id = "Psilocybin (HC; EE) maps"]', { timeout: TIMEOUT, hidden: false});
        await scm_test_page.waitForSelector('li[class = "MuiButtonBase-root MuiListItem-root MuiMenuItem-root secondary-color MuiMenuItem-gutters MuiListItem-gutters MuiListItem-button"]', { timeout: TIMEOUT, hidden: false});
        await scm_test_page.hover('li[class = "MuiButtonBase-root MuiListItem-root MuiMenuItem-root secondary-color MuiMenuItem-gutters MuiListItem-gutters MuiListItem-button"]');
        await scm_test_page.waitForSelector('li[class = "MuiButtonBase-root MuiListItem-root MuiMenuItem-root MuiMenuItem-gutters MuiListItem-gutters MuiListItem-button"]', { timeout: TIMEOUT, hidden: false});
        
        const selector = 'li[class = "MuiButtonBase-root MuiListItem-root MuiMenuItem-root MuiMenuItem-gutters MuiListItem-gutters MuiListItem-button"]';

        await scm_test_page.waitForFunction(
        (selector) => document.querySelectorAll(selector).length > 3,
        { timeout: TIMEOUT },
        selector
        );

        const atlas_mnetadata_selector = 'li[class = "MuiButtonBase-root MuiListItem-root MuiMenuItem-root MuiMenuItem-gutters MuiListItem-gutters MuiListItem-button"]';
        const elements = await scm_test_page.$$(atlas_mnetadata_selector);
        await elements[elements.length - 1].click();

        await scm_test_page.waitForSelector('#geppetto-menu-btn', { timeout: TIMEOUT, hidden: false});
        await scm_test_page.waitForFunction(
            (selector, text) => document.querySelector(selector).textContent === text,
            { timeout: TIMEOUT },
            '#geppetto-menu-btn',
            'Psilocybin (HC; EE) maps'
          );

          console.log('Social Context Map Changed')
    });

    test('Context Map Comparison', async () => {
        console.log('Comparing Context Maps ...');
        const element = await scm_test_page.$('canvas'); 
        const screenshot = await element.screenshot();
        
        expect(screenshot).toMatchImageSnapshot({
          ...SNAPSHOT_OPTIONS,
          customSnapshotIdentifier: 'Updated Atlas Map'
        });

        console.log('Context Maps Compared')
    });


   
});