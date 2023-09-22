import { Selector } from 'testcafe';

const getElementsByXPath = Selector(xpath => {
    const iterator = document.evaluate(xpath, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
    const items = [];
    let item = iterator.iterateNext();
    while (item) {
        items.push(item);
        item = iterator.iterateNext();
    }
    return items;
});
export default function (xpath) {
    return Selector(getElementsByXPath(xpath));
}

fixture `Microsoft page`
    .page `https://www.microsoft.com/en-us`;

test('validate Microfost\'s search bar', async t => {
    await t
    .maximizeWindow()
    .wait(2000)
    .expect(Selector('button#search').exists).ok({timeout:3000}, 'Assert element exists')
    .expect(Selector('button#search').textContent).contains('Search', {timeout:3000}, 'Assert element contains "Search"')
    .click(Selector('button#search'))
    .typeText(Selector(getElementsByXPath('//input[@id="cli_shellHeaderSearchInput"]')), 'Surface pro')
    .click(Selector('button#search'))
    .wait(2000)
    if(await Selector(getElementsByXPath('//div[3]/div/div[1]/div[1]/button')).exists)
        await t.click(Selector(getElementsByXPath('//div[3]/div/div[1]/div[1]/button')))        
    .expect(Selector(getElementsByXPath('//ul/li//h4')).count).gt(0, {timeout:3000}, 'Search results greater than 0')
    .expect(Selector(getElementsByXPath('//nav/ul/li/a[contains(text(),"Shop")]')).exists).ok({timeout:3000}, 'Assert "Shop" category')
    .expect(Selector(getElementsByXPath('//nav/ul/li/a[contains(text(),"Explore")]')).exists).ok({timeout:3000}, 'Assert "Explore" category')
    .click(Selector(getElementsByXPath('//nav/ul/li/a[contains(text(),"Shop")]')))
    .expect(Selector('section[aria-label*="Hardware and Accessories"] section:nth-of-type(1)>div>div>div').count).eql(4, {timeout:3000}, 'Assert 4 elements displayed for "Hardware and Accesories"')
    .takeScreenshot()
    .selectText(Selector(getElementsByXPath('//input')))
    .pressKey('Delete')
    .typeText(Selector(getElementsByXPath('//input')), 'Windows')
    .click(Selector('button#search'))
    .click(Selector(getElementsByXPath('//nav/ul/li/a[contains(text(),"Shop")]')))
    .expect(Selector('section[aria-label*="Software"] h4').innerText).contains('9', {timeout: 3000}, 'Assert 9 results for "Software"')
    .takeScreenshot()
    .wait(5000)
});