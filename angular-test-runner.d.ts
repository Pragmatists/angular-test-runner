declare interface AngularTestRunner {
  app: (modules: string[]) => angularTestRunner.ITestRunnerApp;
  http: (settings?: angularTestRunner.ITestRunnerHttpSettings) => angularTestRunner.ITestRunnerHttp;
  actions: angularTestRunner.ITestRunnerActions;
}

declare namespace angularTestRunner {

  interface ITestRunnerApp {
    stop: () => void;
    runHtml: (html: string, scope?: any) => ITestHtml;
    run: (location: string, scope?: any) => ITestHtml;
  }

  interface ITestRunnerHttpSettings {
    autoRespond?: boolean;
    respondImmediately?: boolean;
    respondAfter?: number;
  }

  interface ITestHtml {
    perform: (...actions: IAction[]) => void;
    verify: (...actions: IVerificationAction[]) => void;
    destroy: () => void;
  }

  interface IHttpRequest {
    body: () => any;
    query: () => any;
    header: (name: string) => string;
    sendJson: (json: any) => void;
    sendStatus: (status: number, json?: any) => void
  }

  type IHttpHandler = (request: IHttpRequest) => any;
  type IHttpEndpoint = (url: string | RegExp, handler: IHttpHandler) => any;

  interface ITestRunnerHttp {

    get: IHttpEndpoint;
    post: IHttpEndpoint;
    put: IHttpEndpoint;
    delete: IHttpEndpoint;
    stop: () => any;
    respond: () => any;

  }

  type IAction = (JQuery) => any;

  interface IAfterAction {
    after?: (number) => IAction;
  }

  type IVerificationAction = IAction & IAfterAction;

  interface IInAction {
    in: (string) => IAction & IAfterAction;
  }

  type IKeyAction = (key: number) => IAction & IInAction;

  interface ITestRunnerActions {

    click: IAction & IInAction;
    type: (text: string) => IAction & IInAction;
    keydown: IKeyAction;
    keypress: IKeyAction;
    keyup: IKeyAction;
    mouseover: IAction & IInAction;
    mouseleave: IAction & IInAction;
    wait: (delay: number) => IAction;
    apply: IAction;
    navigateTo: (url: string) => IAction;
    expectElement: (selector: string) => Matchers;
    listenTo: (eventName: string, handler: (data: any) => void) => IAction;
    publishEvent: (eventName: string, data: any) => IAction;
  }

  interface Matchers {

    /**
     * Check if DOM element has class.
     *
     * @param className Name of the class to check.
     *
     * @example
     * // returns true
     * expect($('<div class="some-class"></div>')).toHaveClass("some-class")
     */
    toHaveClass(className: string): IVerificationAction;

    /**
     * Check if DOM element has the given CSS properties.
     *
     * @param css Object containing the properties (and values) to check.
     *
     * @example
     * // returns true
     * expect($('<div style="display: none; margin: 10px;"></div>')).toHaveCss({display: "none", margin: "10px"})
     *
     * @example
     * // returns true
     * expect($('<div style="display: none; margin: 10px;"></div>')).toHaveCss({margin: "10px"})
     */
    toHaveCss(css: any): IVerificationAction;

    /**
     * Checks if DOM element is visible.
     * Elements are considered visible if they consume space in the document. Visible elements have a width or height that is greater than zero.
     */
    toBeVisible(): IVerificationAction;
    /**
     * Check if DOM element is hidden.
     * Elements can be hidden for several reasons:
     * - They have a CSS display value of none ;
     * - They are form elements with type equal to hidden.
     * - Their width and height are explicitly set to 0.
     * - An ancestor element is hidden, so the element is not shown on the page.
     */
    toBeHidden(): IVerificationAction;

    /**
     * Only for tags that have checked attribute
     *
     * @example
     * // returns true
     * expect($('<option selected="selected"></option>')).toBeSelected()
     */
    toBeSelected(): IVerificationAction;

    /**
     * Only for tags that have checked attribute
     * @example
     * // returns true
     * expect($('<input type="checkbox" checked="checked"/>')).toBeChecked()
     */
    toBeChecked(): IVerificationAction;

    /**
     * Checks for child DOM elements or text
     */
    toBeEmpty(): IVerificationAction;

    /**
     * Checks if element exists in or out the DOM.
     */
    toExist(): IVerificationAction;

    /**
     * Checks if array has the given length.
     *
     * @param length Expected length
     */
    toHaveLength(length: number): IVerificationAction;

    /**
     * Check if DOM element contains an attribute and, optionally, if the value of the attribute is equal to the expected one.
     *
     * @param attributeName Name of the attribute to check
     * @param expectedAttributeValue Expected attribute value
     */
    toHaveAttr(attributeName: string, expectedAttributeValue?: any): IVerificationAction;

    /**
     * Check if DOM element contains a property and, optionally, if the value of the property is equal to the expected one.
     *
     * @param propertyName Property name to check
     * @param expectedPropertyValue Expected property value
     */
    toHaveProp(propertyName: string, expectedPropertyValue?: any): IVerificationAction;

    /**
     * Check if DOM element has the given Id
     *
     * @param Id Expected identifier
     */
    toHaveId(id: string): IVerificationAction;

    /**
     * Check if DOM element has the specified HTML.
     *
     * @example
     * // returns true
     * expect($('<div><span></span></div>')).toHaveHtml('<span></span>')
     */
    toHaveHtml(html: string): IVerificationAction;

    /**
     * Check if DOM element contains the specified HTML.
     *
     * @example
     * // returns true
     * expect($('<div><ul></ul><h1>header</h1></div>')).toContainHtml('<ul></ul>')
     */
    toContainHtml(html: string): IVerificationAction;

    /**
     * Check if DOM element has the given Text.
     * @param text Accepts a string or regular expression
     *
     * @example
     * // returns true
     * expect($('<div>some text</div>')).toHaveText('some text')
     */
    toHaveText(text: string): IVerificationAction;
    /**
     * Check if DOM element contains the specified text.
     *
     * @example
     * // returns true
     * expect($('<div><ul></ul><h1>header</h1></div>')).toContainText('header')
     */
    toContainText(text: string): IVerificationAction;

    /**
     * Check if DOM element has the given value.
     * This can only be applied for element on with jQuery val() can be called.
     *
     * @example
     * // returns true
     * expect($('<input type="text" value="some text"/>')).toHaveValue('some text')
     */
    toHaveValue(value: string): IVerificationAction;

    /**
     * Check if DOM element has the given data.
     * This can only be applied for element on with jQuery data(key) can be called.
     *
     */
    toHaveData(key: string, expectedValue: string): IVerificationAction;
    toBe(selector: JQuery): IVerificationAction;

    /**
     * Check if DOM element is matched by the given selector.
     *
     * @example
     * // returns true
     * expect($('<div><span class="some-class"></span></div>')).toContain('some-class')
     */
    toContain(selector: JQuery): IVerificationAction;

    /**
     * Check if DOM element exists inside the given parent element.
     *
     * @example
     * // returns true
     * expect($('<div><span class="some-class"></span></div>')).toContainElement('span.some-class')
     */
    toContainElement(selector: string): IVerificationAction;

    /**
     * Check to see if the set of matched elements matches the given selector
     *
     * @example
     * expect($('<span></span>').addClass('js-something')).toBeMatchedBy('.js-something')
     *
     * @returns {Boolean} true if DOM contains the element
     */
    toBeMatchedBy(selector: string): IVerificationAction;

    /**
     * Only for tags that have disabled attribute
     * @example
     * // returns true
     * expect('<input type="submit" disabled="disabled"/>').toBeDisabled()
     */
    toBeDisabled(): IVerificationAction;

    /**
     * Check if DOM element is focused
     * @example
     * // returns true
     * expect($('<input type="text" />').focus()).toBeFocused()
     */
    toBeFocused(): IVerificationAction;

    /**
     * Checks if DOM element handles event.
     *
     * @example
     * // returns true
     * expect($form).toHandle("submit")
     */
    toHandle(eventName: string): IVerificationAction;

    /**
     * Assigns a callback to an event of the DOM element.
     *
     * @param eventName Name of the event to assign the callback to.
     * @param eventHandler Callback function to be assigned.
     *
     * @example
     * expect($form).toHandleWith("submit", yourSubmitCallback)
     */
    toHandleWith(eventName: string, eventHandler: (...params: any[]) => any): IVerificationAction;

    /**
     * Checks if event was triggered.
     */
    toHaveBeenTriggered(): IVerificationAction;

    /**
     * Checks if the event has been triggered on selector.
     * @param selector Selector that should have triggered the event.
     */
    toHaveBeenTriggeredOn(selector: string): IVerificationAction;

    /**
     * Checks if the event has been triggered on selector.
     * @param selector Selector that should have triggered the event.
     * @param args Extra arguments to be passed to jQuery events functions.
     */
    toHaveBeenTriggeredOnAndWith(selector: string, ...args: any[]): IVerificationAction;

    /**
     * Checks if event propagation has been prevented.
     */
    toHaveBeenPrevented(): IVerificationAction;

    /**
     * Checks if event propagation has been prevented on element with selector.
     *
     * @param selector Selector that should have prevented the event.
     */
    toHaveBeenPreventedOn(selector: string): IVerificationAction;

    /**
     * Checks if event propagation has been stopped.
     *
     * @example
     * // returns true
     * var spyEvent = spyOnEvent('#some_element', 'click')
     * $('#some_element').click(function (event){event.stopPropagation();})
     * $('#some_element').click()
     * expect(spyEvent).toHaveBeenStopped()
     */
    toHaveBeenStopped(): IVerificationAction;

    /**
     * Checks if event propagation has been stopped by an element with the given selector.
     * @param selector Selector of the element that should have stopped the event propagation.
     *
     * @example
     * // returns true
     * $('#some_element').click(function (event){event.stopPropagation();})
     * $('#some_element').click()
     * expect('click').toHaveBeenStoppedOn('#some_element')
     */
    toHaveBeenStoppedOn(selector: string): IVerificationAction;

    /**
     * Checks to see if the matched element is attached to the DOM.
     * @example
     * expect($('#id-name')[0]).toBeInDOM()
     */
    toBeInDOM(): IVerificationAction;

    not: Matchers;
  }

  interface JQuery {
    find(element: any): JQuery;
    find(obj: JQuery): JQuery;
  }
}

declare const angularTestRunner: AngularTestRunner;

export = angularTestRunner;
