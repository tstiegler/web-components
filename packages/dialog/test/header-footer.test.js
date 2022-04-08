import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../vaadin-dialog.js';
import { createRenderer } from './helpers.js';

describe('header/footer feature', () => {
  let dialog, overlay;

  beforeEach(() => {
    dialog = fixtureSync('<vaadin-dialog></vaadin-dialog>');
    overlay = dialog.$.overlay;
  });

  afterEach(() => {
    dialog.opened = false;
  });

  describe('vaadin-dialog header-title attribute', () => {
    const HEADER_TITLE = '__HEADER_TITLE__';

    it('should not have title element if header-title is not set', () => {
      dialog.opened = true;

      expect(overlay.querySelector('[slot="title"]')).to.not.exist;
    });

    it('should render header-title when set', () => {
      dialog.headerTitle = HEADER_TITLE;
      dialog.opened = true;

      expect(overlay.querySelector('[slot=title]')).to.exist;
      expect(overlay.textContent).to.include(HEADER_TITLE);
    });

    it('should remove title element if header-title is unset', () => {
      dialog.headerTitle = HEADER_TITLE;
      dialog.opened = true;

      dialog.headerTitle = null;
      expect(overlay.querySelector('[slot=title]')).to.not.exist;
    });

    it('should remove title element if header-title is set to empty string', () => {
      dialog.headerTitle = HEADER_TITLE;
      dialog.opened = true;

      dialog.headerTitle = '';
      expect(overlay.querySelector('[slot=title]')).to.not.exist;
    });

    it('should not have [has-title] attribute on overlay element if header-title is not set', () => {
      dialog.opened = true;

      expect(overlay.hasAttribute('has-title')).to.be.not.ok;
    });

    it('should add [has-title] attribute on overlay element if header-title is set', () => {
      dialog.headerTitle = HEADER_TITLE;
      dialog.opened = true;

      expect(overlay.hasAttribute('has-title')).to.be.ok;
    });

    it('should remove [has-title] attribute on overlay element if header-title is unset', () => {
      dialog.headerTitle = HEADER_TITLE;
      dialog.opened = true;

      dialog.headerTitle = null;

      expect(overlay.hasAttribute('has-title')).to.be.not.ok;
    });

    it('[part=header] should have display:none if no header-title is set', () => {
      dialog.opened = true;

      expect(getComputedStyle(overlay.shadowRoot.querySelector('[part=header]')).display).to.be.equal('none');
    });

    it('[part=header] should be displayed if header-title is set', () => {
      dialog.headerTitle = HEADER_TITLE;
      dialog.opened = true;

      expect(getComputedStyle(overlay.shadowRoot.querySelector('[part=header]')).display).to.not.be.equal('none');
    });

    describe('accessibility', () => {
      it('should add arial-labelledby to overlay if header-title is set', () => {
        expect(overlay.hasAttribute('aria-labelledby')).to.be.false;

        dialog.headerTitle = HEADER_TITLE;
        dialog.opened = true;

        expect(overlay.hasAttribute('aria-labelledby')).to.be.true;
        const title = overlay.querySelector('[slot=title]');
        expect(overlay.getAttribute('aria-labelledby')).to.equal(title.id);
      });

      it('should remove aria-labelledby if header-title is unset', () => {
        dialog.headerTitle = HEADER_TITLE;
        dialog.opened = true;

        dialog.headerTitle = null;
        expect(overlay.hasAttribute('aria-labelledby')).to.be.false;
      });

      it('two dialogs should not have the same `aria-labelledby` value', () => {
        const anotherDialog = fixtureSync('<vaadin-dialog></vaadin-dialog>');
        const anotherOverlay = anotherDialog.$.overlay;
        anotherDialog.headerTitle = HEADER_TITLE;
        anotherDialog.opened = true;

        dialog.headerTitle = HEADER_TITLE;
        dialog.opened = true;

        expect(anotherOverlay.getAttribute('aria-labelledby')).to.be.not.equal(overlay.getAttribute('aria-labelledby'));
      });
    });
  });

  describe('vaadin-dialog headerRenderer', () => {
    const HEADER_CONTENT = '__HEADER_CONTENT__';
    const headerRenderer = createRenderer(HEADER_CONTENT);

    it('should not have header[slot=header-content] if headerRenderer is not set', () => {
      dialog.opened = true;
      expect(overlay.querySelector('header[slot=header-content]')).to.not.exist;
    });

    it('should render header content if headerRenderer is set', () => {
      dialog.headerRenderer = headerRenderer;
      dialog.opened = true;

      expect(overlay.textContent).to.include(HEADER_CONTENT);
      expect(overlay.querySelector('div[slot=header-content]')).to.exist;
    });

    it('should remove header element if headerRenderer is removed', () => {
      dialog.headerRenderer = headerRenderer;
      dialog.opened = true;

      dialog.headerRenderer = null;

      expect(overlay.textContent).to.not.include(HEADER_CONTENT);
      expect(overlay.querySelector('div[slot=header-content]')).to.not.exist;
    });

    it('should render new content if another headerRenderer is set', () => {
      dialog.headerRenderer = headerRenderer;
      dialog.opened = true;

      const NEW_HEADER_CONTENT = '__NEW_HEADER_CONTENT__';
      dialog.headerRenderer = createRenderer(NEW_HEADER_CONTENT);

      expect(overlay.textContent).to.include(NEW_HEADER_CONTENT);
      expect(overlay.textContent).to.not.include(HEADER_CONTENT);
    });

    it('should not have [has-header] attribute if no headerRenderer is set', () => {
      dialog.opened = true;

      expect(overlay.hasAttribute('has-header')).to.be.not.ok;
    });

    it('should add [has-header] attribute if headerRenderer is set', () => {
      dialog.headerRenderer = headerRenderer;
      dialog.opened = true;

      expect(overlay.hasAttribute('has-header')).to.be.ok;
    });

    it('should remove [has-header] attribute if headerRenderer is unset', () => {
      dialog.headerRenderer = headerRenderer;
      dialog.opened = true;

      dialog.headerRenderer = null;
      expect(overlay.hasAttribute('has-header')).to.be.not.ok;
    });

    it('[part=header] should have display:none if no headerRenderer is set', () => {
      dialog.opened = true;

      expect(getComputedStyle(overlay.shadowRoot.querySelector('[part=header]')).display).to.be.equal('none');
    });

    it('[part=header] should be displayed if headerRenderer is set', () => {
      dialog.headerRenderer = headerRenderer;
      dialog.opened = true;

      expect(getComputedStyle(overlay.shadowRoot.querySelector('[part=header]')).display).to.not.be.equal('none');
    });
  });

  describe('vaadin-dialog footerRenderer', () => {
    const FOOTER_CONTENT = '__FOOTER_CONTENT__';
    const footerRenderer = createRenderer(FOOTER_CONTENT);

    it('should not have footer[slot=footer] if footerRenderer is not set', () => {
      dialog.opened = true;
      expect(overlay.querySelector('footer[slot=footer]')).to.not.exist;
    });

    it('should render footer content if footerRenderer is set', () => {
      dialog.footerRenderer = footerRenderer;
      dialog.opened = true;

      expect(overlay.textContent).to.include(FOOTER_CONTENT);
      expect(overlay.querySelector('div[slot=footer]')).to.exist;
    });

    it('should remove footer element if footerRenderer is removed', () => {
      dialog.footerRenderer = footerRenderer;
      dialog.opened = true;

      dialog.footerRenderer = null;

      expect(overlay.textContent).to.not.include(FOOTER_CONTENT);
      expect(overlay.querySelector('div[slot=footer]')).to.not.exist;
    });

    it('should render new content if another footerRenderer is set', () => {
      dialog.footerRenderer = footerRenderer;
      dialog.opened = true;
      const NEW_FOOTER_CONTENT = '__NEW_FOOTER_CONTENT__';

      dialog.footerRenderer = createRenderer(NEW_FOOTER_CONTENT);

      expect(overlay.textContent).to.include(NEW_FOOTER_CONTENT);
      expect(overlay.textContent).to.not.include(FOOTER_CONTENT);
    });

    it('should not have [has-footer] attribute if no footerRenderer is set', () => {
      dialog.opened = true;

      expect(overlay.hasAttribute('has-footer')).to.be.not.ok;
    });

    it('should add [has-footer] attribute if footerRenderer is set', () => {
      dialog.footerRenderer = footerRenderer;
      dialog.opened = true;

      expect(overlay.hasAttribute('has-footer')).to.be.ok;
    });

    it('should remove [has-footer] attribute if footerRenderer is unset', () => {
      dialog.footerRenderer = footerRenderer;
      dialog.opened = true;

      dialog.footerRenderer = null;
      expect(overlay.hasAttribute('has-footer')).to.be.not.ok;
    });

    it('[part=footer] should have display:none if no footerRenderer is set', () => {
      dialog.opened = true;

      expect(getComputedStyle(overlay.shadowRoot.querySelector('[part=footer]')).display).to.be.equal('none');
    });

    it('[part=footer] should be displayed if footerRenderer is set', () => {
      dialog.footerRenderer = footerRenderer;
      dialog.opened = true;

      expect(getComputedStyle(overlay.shadowRoot.querySelector('[part=footer]')).display).to.not.be.equal('none');
    });
  });

  describe('header/footer renderer with default renderer', () => {
    const HEADER_CONTENT = '__HEADER_CONTENT__';
    const headerRenderer = createRenderer(HEADER_CONTENT);

    const FOOTER_CONTENT = '__FOOTER_CONTENT__';
    const footerRenderer = createRenderer(FOOTER_CONTENT);

    const BODY_CONTENT = '__BODY_CONTENT__';
    const renderer = createRenderer(BODY_CONTENT);

    it('header and footer renderer should work with default renderer', () => {
      dialog.renderer = renderer;
      dialog.footerRenderer = footerRenderer;
      dialog.headerRenderer = headerRenderer;
      dialog.opened = true;

      expect(overlay.textContent).to.include(HEADER_CONTENT);
      expect(overlay.textContent).to.include(BODY_CONTENT);
      expect(overlay.textContent).to.include(FOOTER_CONTENT);
    });

    it('header and footer renderer should work with default renderer is changed', () => {
      dialog.renderer = renderer;
      dialog.footerRenderer = footerRenderer;
      dialog.headerRenderer = headerRenderer;
      dialog.opened = true;

      const NEW_BODY_CONTENT = '__NEW_BODY_CONTENT__';
      dialog.renderer = createRenderer(NEW_BODY_CONTENT);

      expect(overlay.textContent).to.include(HEADER_CONTENT);

      expect(overlay.textContent).to.not.include(BODY_CONTENT);
      expect(overlay.textContent).to.include(NEW_BODY_CONTENT);

      expect(overlay.textContent).to.include(FOOTER_CONTENT);
    });

    it('header and footer renderer can be changed and default renderer is not changed', () => {
      dialog.renderer = renderer;
      dialog.footerRenderer = footerRenderer;
      dialog.headerRenderer = headerRenderer;
      dialog.opened = true;

      const NEW_HEADER_CONTENT = '__NEW_HEADER_CONTENT__';
      dialog.headerRenderer = createRenderer(NEW_HEADER_CONTENT);

      const NEW_FOOTER_CONTENT = '__NEW_FOOTER_CONTENT__';
      dialog.footerRenderer = createRenderer(NEW_FOOTER_CONTENT);

      expect(overlay.textContent).to.not.include(HEADER_CONTENT);
      expect(overlay.textContent).to.include(NEW_HEADER_CONTENT);

      expect(overlay.textContent).to.include(BODY_CONTENT);

      expect(overlay.textContent).to.not.include(FOOTER_CONTENT);
      expect(overlay.textContent).to.include(NEW_FOOTER_CONTENT);
    });
  });

  describe('header-title with default renderer', () => {
    const HEADER_TITLE = '__HEADER_TITLE__';
    const BODY_CONTENT = '__BODY_CONTENT__';
    const NEW_BODY_CONTENT = '__NEW_BODY_CONTENT__';

    it('should keep header-title if renderer is added', () => {
      dialog.headerTitle = HEADER_TITLE;
      dialog.renderer = createRenderer(BODY_CONTENT);
      dialog.opened = true;

      expect(overlay.textContent).to.include(HEADER_TITLE);
      expect(overlay.textContent).to.include(BODY_CONTENT);
    });

    it('should keep header-title if renderer is changed', () => {
      dialog.headerTitle = HEADER_TITLE;
      dialog.renderer = createRenderer(BODY_CONTENT);
      dialog.renderer = createRenderer(NEW_BODY_CONTENT);
      dialog.opened = true;

      expect(overlay.textContent).to.include(HEADER_TITLE);
      expect(overlay.textContent).to.not.include(BODY_CONTENT);
      expect(overlay.textContent).to.include(NEW_BODY_CONTENT);
    });

    it('should keep header-title if renderer is changed while dialog is opened', () => {
      dialog.headerTitle = HEADER_TITLE;
      dialog.renderer = createRenderer(BODY_CONTENT);
      dialog.opened = true;
      dialog.renderer = createRenderer(NEW_BODY_CONTENT);

      expect(overlay.textContent).to.include(HEADER_TITLE);
      expect(overlay.textContent).to.not.include(BODY_CONTENT);
      expect(overlay.textContent).to.include(NEW_BODY_CONTENT);
    });
  });

  describe('header-title with headerRenderer', () => {
    const HEADER_CONTENT = '__HEADER_CONTENT__';
    const headerRenderer = createRenderer(HEADER_CONTENT);
    const HEADER_TITLE = '__HEADER_TITLE__';

    it('should have both header-title and headerRenderer rendered', () => {
      dialog.headerTitle = HEADER_TITLE;
      dialog.headerRenderer = headerRenderer;
      dialog.opened = true;

      expect(overlay.textContent).to.include(HEADER_TITLE);
      expect(overlay.textContent).to.include(HEADER_CONTENT);
    });

    it('should keep [part=header] visible if header-title is removed', () => {
      dialog.headerTitle = HEADER_TITLE;
      dialog.headerRenderer = headerRenderer;
      dialog.opened = true;

      const headerPart = overlay.shadowRoot.querySelector('[part=header]');

      expect(getComputedStyle(headerPart).display).to.not.be.equal('none');

      dialog.headerTitle = null;
      expect(getComputedStyle(headerPart).display).to.not.be.equal('none');
    });

    it('should keep [part=header] visible if headerRenderer is removed', () => {
      dialog.headerTitle = HEADER_TITLE;
      dialog.headerRenderer = headerRenderer;
      dialog.opened = true;

      const headerPart = overlay.shadowRoot.querySelector('[part=header]');

      expect(getComputedStyle(headerPart).display).to.not.be.equal('none');

      dialog.headerRenderer = null;
      expect(getComputedStyle(headerPart).display).to.not.be.equal('none');
    });

    it('should make [part=header] invisible if both header-title and headerRenderer are removed', () => {
      dialog.headerTitle = HEADER_TITLE;
      dialog.headerRenderer = headerRenderer;
      dialog.opened = true;

      const headerPart = overlay.shadowRoot.querySelector('[part=header]');

      expect(getComputedStyle(headerPart).display).to.not.be.equal('none');

      dialog.headerTitle = null;
      dialog.headerRenderer = null;
      expect(getComputedStyle(headerPart).display).to.be.equal('none');
    });
  });
});