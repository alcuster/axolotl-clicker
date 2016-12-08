import { AxolotlClickerPage } from './app.po';

describe('axolotl-clicker App', function() {
  let page: AxolotlClickerPage;

  beforeEach(() => {
    page = new AxolotlClickerPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
