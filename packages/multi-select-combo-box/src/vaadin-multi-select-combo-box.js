/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-multi-select-combo-box-chip.js';
import './vaadin-multi-select-combo-box-container.js';
import './vaadin-multi-select-combo-box-internal.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ResizeMixin } from '@vaadin/component-base/src/resize-mixin.js';
import { processTemplates } from '@vaadin/component-base/src/templates.js';
import { InputControlMixin } from '@vaadin/field-base/src/input-control-mixin.js';
import { InputController } from '@vaadin/field-base/src/input-controller.js';
import { LabelledInputController } from '@vaadin/field-base/src/labelled-input-controller.js';
import { inputFieldShared } from '@vaadin/field-base/src/styles/input-field-shared-styles.js';
import { css, registerStyles, ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const multiSelectComboBox = css`
  :host {
    --chip-min-width: var(--vaadin-multi-select-combo-box-chip-min-width, 4em);
    --input-min-width: var(--vaadin-multi-select-combo-box-input-min-width, 4em);
  }

  [hidden] {
    display: none !important;
  }

  :host([has-value]) ::slotted(input:placeholder-shown) {
    color: transparent !important;
  }

  ::slotted(input) {
    box-sizing: border-box;
    flex: 1 0 var(--input-min-width);
  }

  [part='chip'] {
    flex: 0 1 auto;
    min-width: var(--chip-min-width);
  }

  :host([readonly]) [part~='chip'] {
    pointer-events: none;
  }
`;

registerStyles('vaadin-multi-select-combo-box', [inputFieldShared, multiSelectComboBox], {
  moduleId: 'vaadin-multi-select-combo-box-styles',
});

/**
 * `<vaadin-multi-select-combo-box>` is a web component that wraps `<vaadin-combo-box>` and extends
 * its functionality to allow selecting multiple items, in addition to basic features.
 *
 * ```html
 * <vaadin-multi-select-combo-box id="comboBox"></vaadin-multi-select-combo-box>
 * ```
 *
 * ```js
 * const comboBox = document.querySelector('#comboBox');
 * comboBox.items = ['apple', 'banana', 'lemon', 'orange'];
 * comboBox.selectedItems = ['lemon', 'orange'];
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name              | Description
 * -----------------------|----------------
 * `chip`                 | Chip shown for every selected item
 * `label`                | The label element
 * `input-field`          | The element that wraps prefix, value and suffix
 * `clear-button`         | The clear button
 * `error-message`        | The error message element
 * `helper-text`          | The helper text element wrapper
 * `required-indicator`   | The `required` state indicator element
 * `overflow`             | The chip shown when component width is not enough to fit all chips
 * `overflow-one`         | Set on the overflow chip when only one chip does not fit
 * `overflow-two`         | Set on the overflow chip when two chips do not fit
 * `toggle-button`        | The toggle button
 *
 * The following state attributes are available for styling:
 *
 * Attribute              | Description
 * -----------------------|-----------------
 * `disabled`             | Set to a disabled element
 * `has-value`            | Set when the element has a value
 * `has-label`            | Set when the element has a label
 * `has-helper`           | Set when the element has helper text or slot
 * `has-error-message`    | Set when the element has an error message
 * `invalid`              | Set when the element is invalid
 * `focused`              | Set when the element is focused
 * `focus-ring`           | Set when the element is keyboard focused
 * `opened`               | Set when the dropdown is open
 * `readonly`             | Set to a readonly element
 *
 * The following custom CSS properties are available for styling:
 *
 * Custom property                                      | Description                | Default
 * -----------------------------------------------------|----------------------------|--------
 * `--vaadin-field-default-width`                       | Default width of the field | `12em`
 * `--vaadin-multi-select-combo-box-overlay-max-height` | Max height of the overlay  | `65vh`
 * `--vaadin-multi-select-combo-box-chip-min-width`     | Min width of the chip      | `60px`
 * `--vaadin-multi-select-combo-box-input-min-width`    | Min width of the input     | `4em`
 *
 * ### Internal components
 *
 * In addition to `<vaadin-multi-select-combo-box>` itself, the following internal
 * components are themable:
 *
 * - `<vaadin-multi-select-combo-box-overlay>` - has the same API as `<vaadin-overlay>`.
 * - `<vaadin-multi-select-combo-box-item>` - has the same API as `<vaadin-item>`.
 * - `<vaadin-multi-select-combo-box-container>` - has the same API as `<vaadin-input-container>`.
 *
 * Note: the `theme` attribute value set on `<vaadin-multi-select-combo-box>` is
 * propagated to these components.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/ds/customization/styling-components) documentation.
 *
 * @fires {Event} change - Fired when the user commits a value change.
 * @fires {CustomEvent} custom-values-set - Fired when the user sets a custom value.
 * @fires {CustomEvent} filter-changed - Fired when the `filter` property changes.
 * @fires {CustomEvent} invalid-changed - Fired when the `invalid` property changes.
 * @fires {CustomEvent} selected-items-changed - Fired when the `selectedItems` property changes.
 *
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes ThemableMixin
 * @mixes InputControlMixin
 * @mixes ResizeMixin
 */
class MultiSelectComboBox extends ResizeMixin(InputControlMixin(ThemableMixin(ElementMixin(PolymerElement)))) {
  static get is() {
    return 'vaadin-multi-select-combo-box';
  }

  static get template() {
    return html`
      <div class="vaadin-multi-select-combo-box-container">
        <div part="label">
          <slot name="label"></slot>
          <span part="required-indicator" aria-hidden="true" on-click="focus"></span>
        </div>

        <vaadin-multi-select-combo-box-internal
          id="comboBox"
          items="[[items]]"
          item-id-path="[[itemIdPath]]"
          item-label-path="[[itemLabelPath]]"
          item-value-path="[[itemValuePath]]"
          disabled="[[disabled]]"
          readonly="[[readonly]]"
          auto-open-disabled="[[autoOpenDisabled]]"
          allow-custom-value="[[allowCustomValues]]"
          data-provider="[[dataProvider]]"
          filter="{{filter}}"
          filtered-items="[[filteredItems]]"
          opened="{{opened}}"
          renderer="[[renderer]]"
          theme$="[[theme]]"
          on-combo-box-item-selected="_onComboBoxItemSelected"
          on-change="_onComboBoxChange"
          on-custom-value-set="_onCustomValueSet"
        >
          <vaadin-multi-select-combo-box-container
            part="input-field"
            readonly="[[readonly]]"
            disabled="[[disabled]]"
            invalid="[[invalid]]"
            theme$="[[theme]]"
          >
            <vaadin-multi-select-combo-box-chip
              slot="prefix"
              part$="[[_getOverflowPart(_overflowItems.length)]]"
              disabled="[[disabled]]"
              label="[[_getOverflowLabel(_overflowItems.length)]]"
              title$="[[_getOverflowTitle(_overflowItems)]]"
              hidden$="[[_isOverflowHidden(_overflowItems.length)]]"
              on-mousedown="_preventBlur"
            ></vaadin-multi-select-combo-box-chip>
            <slot name="input"></slot>
            <div id="clearButton" part="clear-button" slot="suffix"></div>
            <div id="toggleButton" class="toggle-button" part="toggle-button" slot="suffix"></div>
          </vaadin-multi-select-combo-box-container>
        </vaadin-multi-select-combo-box-internal>

        <div part="helper-text">
          <slot name="helper"></slot>
        </div>

        <div part="error-message">
          <slot name="error-message"></slot>
        </div>
      </div>
    `;
  }

  static get properties() {
    return {
      /**
       * Set true to prevent the overlay from opening automatically.
       * @attr {boolean} auto-open-disabled
       */
      autoOpenDisabled: Boolean,

      /**
       * Set to true to display the clear icon which clears the input.
       * @attr {boolean} clear-button-visible
       */
      clearButtonVisible: {
        type: Boolean,
        reflectToAttribute: true,
        observer: '_clearButtonVisibleChanged',
        value: false,
      },

      /**
       * A full set of items to filter the visible options from.
       * The items can be of either `String` or `Object` type.
       */
      items: {
        type: Array,
      },

      /**
       * The item property used for a visual representation of the item.
       * @attr {string} item-label-path
       */
      itemLabelPath: {
        type: String,
      },

      /**
       * Path for the value of the item. If `items` is an array of objects,
       * this property is used as a string value for the selected item.
       * @attr {string} item-value-path
       */
      itemValuePath: {
        type: String,
      },

      /**
       * Path for the id of the item, used to detect whether the item is selected.
       * @attr {string} item-id-path
       */
      itemIdPath: {
        type: String,
      },

      /**
       * When present, it specifies that the field is read-only.
       */
      readonly: {
        type: Boolean,
        value: false,
        observer: '_readonlyChanged',
        reflectToAttribute: true,
      },

      /**
       * The list of selected items.
       * Note: modifying the selected items creates a new array each time.
       */
      selectedItems: {
        type: Array,
        value: () => [],
        notify: true,
      },

      /**
       * True if the dropdown is open, false otherwise.
       */
      opened: {
        type: Boolean,
        notify: true,
        value: false,
        reflectToAttribute: true,
      },

      /**
       * Number of items fetched at a time from the data provider.
       * @attr {number} page-size
       */
      pageSize: {
        type: Number,
        value: 50,
        observer: '_pageSizeChanged',
      },

      /**
       * Function that provides items lazily. Receives two arguments:
       *
       * - `params` - Object with the following properties:
       *   - `params.page` Requested page index
       *   - `params.pageSize` Current page size
       *   - `params.filter` Currently applied filter
       *
       * - `callback(items, size)` - Callback function with arguments:
       *   - `items` Current page of items
       *   - `size` Total number of items.
       */
      dataProvider: {
        type: Object,
        observer: '_dataProviderChanged',
      },

      /**
       * When true, the user can input a value that is not present in the items list.
       * @attr {boolean} allow-custom-values
       */
      allowCustomValues: {
        type: Boolean,
        value: false,
      },

      /**
       * Custom function for rendering the content of every item.
       * Receives three arguments:
       *
       * - `root` The `<vaadin-multi-select-combo-box-item>` internal container DOM element.
       * - `comboBox` The reference to the `<vaadin-combo-box>` element.
       * - `model` The object with the properties related with the rendered
       *   item, contains:
       *   - `model.index` The index of the rendered item.
       *   - `model.item` The item.
       */
      renderer: Function,

      /**
       * Filtering string the user has typed into the input field.
       */
      filter: {
        type: String,
        value: '',
        notify: true,
      },

      /**
       * A subset of items, filtered based on the user input. Filtered items
       * can be assigned directly to omit the internal filtering functionality.
       * The items can be of either `String` or `Object` type.
       */
      filteredItems: Array,

      /** @protected */
      _hasValue: {
        type: Boolean,
        value: false,
      },

      /** @private */
      _overflowItems: {
        type: Array,
        value: () => [],
      },
    };
  }

  static get observers() {
    return ['_selectedItemsChanged(selectedItems, selectedItems.*)'];
  }

  /**
   * Used by `ClearButtonMixin` as a reference to the clear button element.
   * @protected
   * @return {!HTMLElement}
   */
  get clearElement() {
    return this.$.clearButton;
  }

  /** @protected */
  get _chips() {
    return this.shadowRoot.querySelectorAll('[part~="chip"]');
  }

  /** @protected */
  ready() {
    super.ready();

    this.addController(
      new InputController(this, (input) => {
        this._setInputElement(input);
        this._setFocusElement(input);
        this.stateTarget = input;
        this.ariaTarget = input;
      }),
    );
    this.addController(new LabelledInputController(this.inputElement, this._labelController));

    this._inputField = this.shadowRoot.querySelector('[part="input-field"]');
    this.__updateChips();

    processTemplates(this);
  }

  /**
   * Returns true if the current input value satisfies all constraints (if any).
   * @return {boolean}
   */
  checkValidity() {
    return this.required ? this._hasValue : true;
  }

  /**
   * Override method inherited from `DisabledMixin` to forward disabled to chips.
   * @protected
   * @override
   */
  _disabledChanged(disabled, oldDisabled) {
    super._disabledChanged(disabled, oldDisabled);

    if (disabled || oldDisabled) {
      this._chips.forEach((chip) => {
        chip.toggleAttribute('disabled', disabled);
      });
    }
  }

  /**
   * Override method inherited from `InputMixin` to forward the input to combo-box.
   * @protected
   * @override
   */
  _inputElementChanged(input) {
    super._inputElementChanged(input);

    if (input) {
      this.$.comboBox._setInputElement(input);
    }
  }

  /**
   * Override method inherited from `FocusMixin` to validate on blur.
   * @param {boolean} focused
   * @protected
   */
  _setFocused(focused) {
    super._setFocused(focused);

    if (!focused) {
      this.validate();
    }
  }

  /**
   * Override method inherited from `InputMixin`
   * to keep attribute after clearing the input.
   * @protected
   * @override
   */
  _toggleHasValue() {
    super._toggleHasValue(this._hasValue);
  }

  /**
   * Implement callback from `ResizeMixin` to update chips.
   * @protected
   * @override
   */
  _onResize() {
    this.__updateChips();
  }

  /**
   * Setting clear button visible reduces total space available
   * for rendering chips, and making it hidden increases it.
   * @private
   */
  _clearButtonVisibleChanged(visible, oldVisible) {
    if (visible || oldVisible) {
      this.__updateChips();
    }
  }

  /** @private */
  _readonlyChanged(readonly, oldReadonly) {
    if (readonly) {
      this.__savedItems = this.$.comboBox._getOverlayItems();
      this.$.comboBox._setOverlayItems(Array.from(this.selectedItems));

      // Update chips to hide remove button
      this._chips.forEach((chip) => {
        chip.setAttribute('readonly', '');
      });
    } else if (oldReadonly) {
      this.$.comboBox._setOverlayItems(this.__savedItems);
      this.__savedItems = null;

      this._chips.forEach((chip) => {
        chip.removeAttribute('readonly');
      });
    }
  }

  /** @private */
  _pageSizeChanged(pageSize, oldPageSize) {
    if (Math.floor(pageSize) !== pageSize || pageSize <= 0) {
      this.pageSize = oldPageSize;
      console.error('"pageSize" value must be an integer > 0');
    }

    this.$.comboBox.pageSize = this.pageSize;
  }

  /** @private */
  _selectedItemsChanged(selectedItems) {
    this._hasValue = Boolean(selectedItems && selectedItems.length);

    this._toggleHasValue();

    // Re-render chips
    this.__updateChips();

    if (this.readonly) {
      this.$.comboBox._setOverlayItems(selectedItems);
    }

    // Re-render scroller
    this.$.comboBox.$.dropdown._scroller.requestContentUpdate();

    // Wait for chips to render
    requestAnimationFrame(() => {
      this.$.comboBox.$.dropdown._setOverlayWidth();
    });
  }

  /** @private */
  _getItemLabel(item, itemLabelPath) {
    return item && Object.prototype.hasOwnProperty.call(item, itemLabelPath) ? item[itemLabelPath] : item;
  }

  /** @private */
  _getOverflowLabel(length) {
    return length;
  }

  /** @private */
  _getOverflowPart(length) {
    let part = `chip overflow`;

    if (length === 1) {
      part += ' overflow-one';
    } else if (length === 2) {
      part += ' overflow-two';
    }

    return part;
  }

  /** @private */
  _getOverflowTitle(items) {
    return items.map((item) => this._getItemLabel(item, this.itemLabelPath)).join(', ');
  }

  /** @private */
  _isOverflowHidden(length) {
    return length === 0;
  }

  /** @private */
  _findIndex(item, selectedItems, itemIdPath) {
    if (itemIdPath && item) {
      for (let index = 0; index < selectedItems.length; index++) {
        if (selectedItems[index] && selectedItems[index][itemIdPath] === item[itemIdPath]) {
          return index;
        }
      }
      return -1;
    }

    return selectedItems.indexOf(item);
  }

  /** @private */
  __clearFilter() {
    this.filter = '';
    this.$.comboBox.clear();
  }

  /** @private */
  __removeItem(item) {
    const itemsCopy = [...this.selectedItems];
    itemsCopy.splice(itemsCopy.indexOf(item), 1);
    this.__updateSelection(itemsCopy);
  }

  /** @private */
  __selectItem(item) {
    const itemsCopy = [...this.selectedItems];

    const index = this._findIndex(item, itemsCopy, this.itemIdPath);
    if (index !== -1) {
      // Do not unselect when manually typing and committing an already selected item.
      if (this.filter.toLowerCase() === this._getItemLabel(item, this.itemLabelPath).toLowerCase()) {
        this.__clearFilter();
        return;
      }

      itemsCopy.splice(index, 1);
    } else {
      itemsCopy.push(item);
    }

    this.__updateSelection(itemsCopy);

    // Suppress `value-changed` event.
    this.__clearFilter();
  }

  /** @private */
  __updateSelection(selectedItems) {
    this.selectedItems = selectedItems;

    this.validate();

    this.dispatchEvent(new CustomEvent('change', { bubbles: true }));
  }

  /** @private */
  __createChip(item) {
    const chip = document.createElement('vaadin-multi-select-combo-box-chip');
    chip.setAttribute('part', 'chip');
    chip.setAttribute('slot', 'prefix');

    chip.item = item;
    chip.toggleAttribute('disabled', this.disabled);
    chip.toggleAttribute('readonly', this.readonly);

    const label = this._getItemLabel(item, this.itemLabelPath);
    chip.label = label;
    chip.setAttribute('title', label);

    chip.addEventListener('item-removed', (e) => this._onItemRemoved(e));
    chip.addEventListener('mousedown', (e) => this._preventBlur(e));

    return chip;
  }

  /** @private */
  __getMinWidth(chip) {
    chip.style.visibility = 'hidden';
    chip.style.display = 'block';
    chip.style.minWidth = 'var(--chip-min-width)';

    const result = parseInt(getComputedStyle(chip).minWidth);

    chip.style.minWidth = '';
    chip.style.display = '';
    chip.style.visibility = '';

    return result;
  }

  /** @private */
  __updateChips() {
    if (!this._inputField) {
      return;
    }

    // Clear all chips except the overflow
    const chips = Array.from(this._chips).reverse();
    const overflow = chips.pop();

    chips.forEach((chip) => {
      chip.remove();
    });

    const items = [...this.selectedItems];

    let refNode = overflow.nextElementSibling;

    // Use overflow chip to measure min-width
    const chipMinWidth = this.__getMinWidth(overflow);
    const inputMinWidth = parseInt(getComputedStyle(this.inputElement).flexBasis);
    const containerStyle = getComputedStyle(this._inputField);

    // Detect available width for chips
    let totalWidth =
      parseInt(containerStyle.width) -
      parseInt(containerStyle.paddingLeft) -
      parseInt(containerStyle.paddingRight) -
      this.$.toggleButton.clientWidth -
      inputMinWidth;

    if (this.clearButtonVisible) {
      totalWidth -= this.$.clearButton.clientWidth;
    }

    for (let i = items.length - 1; i >= 0; i--) {
      // Ensure there is enough space for another chip
      if (totalWidth < chipMinWidth) {
        break;
      }

      const item = items.pop();
      const chip = this.__createChip(item);
      this._inputField.insertBefore(chip, refNode);

      refNode = chip;
      totalWidth -= chipMinWidth;
    }

    this._overflowItems = items;
  }

  /**
   * Override method inherited from `ClearButtonMixin` and clear items.
   * @protected
   * @override
   */
  _onClearButtonClick(event) {
    event.stopPropagation();

    this.__updateSelection([]);
  }

  /**
   * Override an event listener from `KeyboardMixin`.
   * @param {KeyboardEvent} event
   * @protected
   * @override
   */
  _onKeyDown(event) {
    const items = this.selectedItems || [];
    if (!this.readonly && event.key === 'Backspace' && items.length && this.inputElement.value === '') {
      this.__removeItem(items[items.length - 1]);
    }
  }

  /** @private */
  _onComboBoxChange() {
    const item = this.$.comboBox.selectedItem;
    if (item) {
      this.__selectItem(item);
    }
  }

  /** @private */
  _onComboBoxItemSelected(event) {
    this.__selectItem(event.detail.item);
  }

  /** @private */
  _onCustomValueSet(event) {
    // Do not set combo-box value
    event.preventDefault();

    this.__clearFilter();

    this.dispatchEvent(
      new CustomEvent('custom-values-set', {
        detail: event.detail,
        composed: true,
        bubbles: true,
      }),
    );
  }

  /** @private */
  _onItemRemoved(event) {
    this.__removeItem(event.detail.item);
  }

  /** @private */
  _preventBlur(event) {
    // Prevent mousedown event to keep the input focused
    // and keep the overlay opened when clicking a chip.
    event.preventDefault();
  }
}

customElements.define(MultiSelectComboBox.is, MultiSelectComboBox);

export { MultiSelectComboBox };
