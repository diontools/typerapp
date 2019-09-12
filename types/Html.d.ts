// Type definitions for Typerapp
// forked from https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/react
// synced: 2019/08/08

/// <reference path="global.d.ts" />

import * as CSS from 'csstype';
import { VNode, Class, Key } from 'typerapp'

type NativeEvent = Event;
type NativeAnimationEvent = AnimationEvent;
type NativeClipboardEvent = ClipboardEvent;
type NativeCompositionEvent = CompositionEvent;
type NativeDragEvent = DragEvent;
type NativeFocusEvent = FocusEvent;
type NativeKeyboardEvent = KeyboardEvent;
type NativeMouseEvent = MouseEvent;
type NativeTouchEvent = TouchEvent;
type NativePointerEvent = PointerEvent;
type NativeTransitionEvent = TransitionEvent;
type NativeUIEvent = UIEvent;
type NativeWheelEvent = WheelEvent;

// tslint:disable-next-line:export-just-namespace
export = Typerapp;
export as namespace Typerapp;

declare namespace Typerapp {
    interface TyperAppAttribute {
        key?: Key
    }

    //
    // Event System
    // ----------------------------------------------------------------------

    type BaseEvent<TEvent, TCurrent = unknown, TTarget = unknown, TReplaces = unknown> = {
        [K in keyof TEvent]:
        K extends keyof TReplaces ? TReplaces[K] :
        K extends 'currentTarget' ? TCurrent :
        K extends 'target' ? TTarget :
        TEvent[K]
    } & Pick<TReplaces, Exclude<keyof TReplaces, keyof TEvent>> // add remain props

    /**
     * currentTarget - a reference to the element on which the event listener is registered.
     *
     * target - a reference to the element from which the event was originally dispatched.
     * This might be a child element to the element on which the event listener is registered.
     * If you thought this should be `EventTarget & T`, see https://github.com/DefinitelyTyped/DefinitelyTyped/pull/12239
     */
    type TypedEvent<TTarget = Element, TEvent = NativeEvent, TReplaces = unknown> = BaseEvent<TEvent, EventTarget & TTarget, EventTarget, TReplaces>

    type ClipboardEvent<T = Element> = TypedEvent<T, NativeClipboardEvent, {
        clipboardData: DataTransfer;
    }>

    type CompositionEvent<T = Element> = TypedEvent<T, NativeCompositionEvent>

    type DragEvent<T = Element> = MouseEvent<T, NativeDragEvent, {
        dataTransfer: DataTransfer;
    }>

    type PointerEvent<T = Element> = MouseEvent<T, NativePointerEvent, {
        pointerType: 'mouse' | 'pen' | 'touch';
    }>

    type FocusEvent<T = Element> = TypedEvent<T, NativeFocusEvent, {
        target: EventTarget & T;
    }>

    type FormEvent<T = Element> = TypedEvent<T>

    type ChangeEvent<T = Element> = TypedEvent<T, Event, {
        target: EventTarget & T;
    }>

    type KeyboardEvent<T = Element> = TypedEvent<T, NativeKeyboardEvent>

    type MouseEvent<T = Element, E = NativeMouseEvent, R = unknown> = TypedEvent<T, E, R>

    type TouchEvent<T = Element> = TypedEvent<T, NativeTouchEvent>

    type UIEvent<T = Element> = TypedEvent<T, NativeUIEvent>

    type WheelEvent<T = Element> = TypedEvent<T, NativeWheelEvent>

    type AnimationEvent<T = Element> = TypedEvent<T, NativeAnimationEvent>

    type TransitionEvent<T = Element> = TypedEvent<T, NativeTransitionEvent>

    //
    // Event Handler Types
    // ----------------------------------------------------------------------

    type EventHandler<E extends TypedEvent<any>> = { bivarianceHack(event: E): void }["bivarianceHack"];

    type TypedEventHandler<T = Element> = EventHandler<TypedEvent<T>>;

    type ClipboardEventHandler<T = Element> = EventHandler<ClipboardEvent<T>>;
    type CompositionEventHandler<T = Element> = EventHandler<CompositionEvent<T>>;
    type DragEventHandler<T = Element> = EventHandler<DragEvent<T>>;
    type FocusEventHandler<T = Element> = EventHandler<FocusEvent<T>>;
    type FormEventHandler<T = Element> = EventHandler<FormEvent<T>>;
    type ChangeEventHandler<T = Element> = EventHandler<ChangeEvent<T>>;
    type KeyboardEventHandler<T = Element> = EventHandler<KeyboardEvent<T>>;
    type MouseEventHandler<T = Element> = EventHandler<MouseEvent<T>>;
    type TouchEventHandler<T = Element> = EventHandler<TouchEvent<T>>;
    type PointerEventHandler<T = Element> = EventHandler<PointerEvent<T>>;
    type UIEventHandler<T = Element> = EventHandler<UIEvent<T>>;
    type WheelEventHandler<T = Element> = EventHandler<WheelEvent<T>>;
    type AnimationEventHandler<T = Element> = EventHandler<AnimationEvent<T>>;
    type TransitionEventHandler<T = Element> = EventHandler<TransitionEvent<T>>;

    //
    // Props / DOM Attributes
    // ----------------------------------------------------------------------

    type DetailedHTMLProps<E extends HTMLAttributes<T>, T> = E & TyperAppAttribute;

    interface SVGProps<T> extends SVGAttributes<T>, TyperAppAttribute {
    }

    interface DOMAttributes<T> {
        children?: VNode;

        // Clipboard Events
        onCopy?: ClipboardEventHandler<T>;
        onCopyCapture?: ClipboardEventHandler<T>;
        onCut?: ClipboardEventHandler<T>;
        onCutCapture?: ClipboardEventHandler<T>;
        onPaste?: ClipboardEventHandler<T>;
        onPasteCapture?: ClipboardEventHandler<T>;

        // Composition Events
        onCompositionEnd?: CompositionEventHandler<T>;
        onCompositionEndCapture?: CompositionEventHandler<T>;
        onCompositionStart?: CompositionEventHandler<T>;
        onCompositionStartCapture?: CompositionEventHandler<T>;
        onCompositionUpdate?: CompositionEventHandler<T>;
        onCompositionUpdateCapture?: CompositionEventHandler<T>;

        // Focus Events
        onFocus?: FocusEventHandler<T>;
        onFocusCapture?: FocusEventHandler<T>;
        onBlur?: FocusEventHandler<T>;
        onBlurCapture?: FocusEventHandler<T>;

        // Form Events
        onChange?: FormEventHandler<T>;
        onChangeCapture?: FormEventHandler<T>;
        onBeforeInput?: FormEventHandler<T>;
        onBeforeInputCapture?: FormEventHandler<T>;
        onInput?: FormEventHandler<T>;
        onInputCapture?: FormEventHandler<T>;
        onReset?: FormEventHandler<T>;
        onResetCapture?: FormEventHandler<T>;
        onSubmit?: FormEventHandler<T>;
        onSubmitCapture?: FormEventHandler<T>;
        onInvalid?: FormEventHandler<T>;
        onInvalidCapture?: FormEventHandler<T>;

        // Image Events
        onLoad?: TypedEventHandler<T>;
        onLoadCapture?: TypedEventHandler<T>;
        onError?: TypedEventHandler<T>; // also a Media Event
        onErrorCapture?: TypedEventHandler<T>; // also a Media Event

        // Keyboard Events
        onKeyDown?: KeyboardEventHandler<T>;
        onKeyDownCapture?: KeyboardEventHandler<T>;
        onKeyPress?: KeyboardEventHandler<T>;
        onKeyPressCapture?: KeyboardEventHandler<T>;
        onKeyUp?: KeyboardEventHandler<T>;
        onKeyUpCapture?: KeyboardEventHandler<T>;

        // Media Events
        onAbort?: TypedEventHandler<T>;
        onAbortCapture?: TypedEventHandler<T>;
        onCanPlay?: TypedEventHandler<T>;
        onCanPlayCapture?: TypedEventHandler<T>;
        onCanPlayThrough?: TypedEventHandler<T>;
        onCanPlayThroughCapture?: TypedEventHandler<T>;
        onDurationChange?: TypedEventHandler<T>;
        onDurationChangeCapture?: TypedEventHandler<T>;
        onEmptied?: TypedEventHandler<T>;
        onEmptiedCapture?: TypedEventHandler<T>;
        onEncrypted?: TypedEventHandler<T>;
        onEncryptedCapture?: TypedEventHandler<T>;
        onEnded?: TypedEventHandler<T>;
        onEndedCapture?: TypedEventHandler<T>;
        onLoadedData?: TypedEventHandler<T>;
        onLoadedDataCapture?: TypedEventHandler<T>;
        onLoadedMetadata?: TypedEventHandler<T>;
        onLoadedMetadataCapture?: TypedEventHandler<T>;
        onLoadStart?: TypedEventHandler<T>;
        onLoadStartCapture?: TypedEventHandler<T>;
        onPause?: TypedEventHandler<T>;
        onPauseCapture?: TypedEventHandler<T>;
        onPlay?: TypedEventHandler<T>;
        onPlayCapture?: TypedEventHandler<T>;
        onPlaying?: TypedEventHandler<T>;
        onPlayingCapture?: TypedEventHandler<T>;
        onProgress?: TypedEventHandler<T>;
        onProgressCapture?: TypedEventHandler<T>;
        onRateChange?: TypedEventHandler<T>;
        onRateChangeCapture?: TypedEventHandler<T>;
        onSeeked?: TypedEventHandler<T>;
        onSeekedCapture?: TypedEventHandler<T>;
        onSeeking?: TypedEventHandler<T>;
        onSeekingCapture?: TypedEventHandler<T>;
        onStalled?: TypedEventHandler<T>;
        onStalledCapture?: TypedEventHandler<T>;
        onSuspend?: TypedEventHandler<T>;
        onSuspendCapture?: TypedEventHandler<T>;
        onTimeUpdate?: TypedEventHandler<T>;
        onTimeUpdateCapture?: TypedEventHandler<T>;
        onVolumeChange?: TypedEventHandler<T>;
        onVolumeChangeCapture?: TypedEventHandler<T>;
        onWaiting?: TypedEventHandler<T>;
        onWaitingCapture?: TypedEventHandler<T>;

        // MouseEvents
        onAuxClick?: MouseEventHandler<T>;
        onAuxClickCapture?: MouseEventHandler<T>;
        onClick?: MouseEventHandler<T>;
        onClickCapture?: MouseEventHandler<T>;
        onContextMenu?: MouseEventHandler<T>;
        onContextMenuCapture?: MouseEventHandler<T>;
        onDoubleClick?: MouseEventHandler<T>;
        onDoubleClickCapture?: MouseEventHandler<T>;
        onDrag?: DragEventHandler<T>;
        onDragCapture?: DragEventHandler<T>;
        onDragEnd?: DragEventHandler<T>;
        onDragEndCapture?: DragEventHandler<T>;
        onDragEnter?: DragEventHandler<T>;
        onDragEnterCapture?: DragEventHandler<T>;
        onDragExit?: DragEventHandler<T>;
        onDragExitCapture?: DragEventHandler<T>;
        onDragLeave?: DragEventHandler<T>;
        onDragLeaveCapture?: DragEventHandler<T>;
        onDragOver?: DragEventHandler<T>;
        onDragOverCapture?: DragEventHandler<T>;
        onDragStart?: DragEventHandler<T>;
        onDragStartCapture?: DragEventHandler<T>;
        onDrop?: DragEventHandler<T>;
        onDropCapture?: DragEventHandler<T>;
        onMouseDown?: MouseEventHandler<T>;
        onMouseDownCapture?: MouseEventHandler<T>;
        onMouseEnter?: MouseEventHandler<T>;
        onMouseLeave?: MouseEventHandler<T>;
        onMouseMove?: MouseEventHandler<T>;
        onMouseMoveCapture?: MouseEventHandler<T>;
        onMouseOut?: MouseEventHandler<T>;
        onMouseOutCapture?: MouseEventHandler<T>;
        onMouseOver?: MouseEventHandler<T>;
        onMouseOverCapture?: MouseEventHandler<T>;
        onMouseUp?: MouseEventHandler<T>;
        onMouseUpCapture?: MouseEventHandler<T>;

        // Selection Events
        onSelect?: TypedEventHandler<T>;
        onSelectCapture?: TypedEventHandler<T>;

        // Touch Events
        onTouchCancel?: TouchEventHandler<T>;
        onTouchCancelCapture?: TouchEventHandler<T>;
        onTouchEnd?: TouchEventHandler<T>;
        onTouchEndCapture?: TouchEventHandler<T>;
        onTouchMove?: TouchEventHandler<T>;
        onTouchMoveCapture?: TouchEventHandler<T>;
        onTouchStart?: TouchEventHandler<T>;
        onTouchStartCapture?: TouchEventHandler<T>;

        // Pointer Events
        onPointerDown?: PointerEventHandler<T>;
        onPointerDownCapture?: PointerEventHandler<T>;
        onPointerMove?: PointerEventHandler<T>;
        onPointerMoveCapture?: PointerEventHandler<T>;
        onPointerUp?: PointerEventHandler<T>;
        onPointerUpCapture?: PointerEventHandler<T>;
        onPointerCancel?: PointerEventHandler<T>;
        onPointerCancelCapture?: PointerEventHandler<T>;
        onPointerEnter?: PointerEventHandler<T>;
        onPointerEnterCapture?: PointerEventHandler<T>;
        onPointerLeave?: PointerEventHandler<T>;
        onPointerLeaveCapture?: PointerEventHandler<T>;
        onPointerOver?: PointerEventHandler<T>;
        onPointerOverCapture?: PointerEventHandler<T>;
        onPointerOut?: PointerEventHandler<T>;
        onPointerOutCapture?: PointerEventHandler<T>;
        onGotPointerCapture?: PointerEventHandler<T>;
        onGotPointerCaptureCapture?: PointerEventHandler<T>;
        onLostPointerCapture?: PointerEventHandler<T>;
        onLostPointerCaptureCapture?: PointerEventHandler<T>;

        // UI Events
        onScroll?: UIEventHandler<T>;
        onScrollCapture?: UIEventHandler<T>;

        // Wheel Events
        onWheel?: WheelEventHandler<T>;
        onWheelCapture?: WheelEventHandler<T>;

        // Animation Events
        onAnimationStart?: AnimationEventHandler<T>;
        onAnimationStartCapture?: AnimationEventHandler<T>;
        onAnimationEnd?: AnimationEventHandler<T>;
        onAnimationEndCapture?: AnimationEventHandler<T>;
        onAnimationIteration?: AnimationEventHandler<T>;
        onAnimationIterationCapture?: AnimationEventHandler<T>;

        // Transition Events
        onTransitionEnd?: TransitionEventHandler<T>;
        onTransitionEndCapture?: TransitionEventHandler<T>;
    }

    export interface CSSProperties extends CSS.Properties<string | number> {
        /**
         * The index signature was removed to enable closed typing for style
         * using CSSType. You're able to use type assertion or module augmentation
         * to add properties or an index signature of your own.
         *
         * For examples and more information, visit:
         * https://github.com/frenic/csstype#what-should-i-do-when-i-get-type-errors
         */
    }

    // All the WAI-ARIA 1.1 attributes from https://www.w3.org/TR/wai-aria-1.1/
    interface AriaAttributes {
        /** Identifies the currently active element when DOM focus is on a composite widget, textbox, group, or application. */
        'aria-activedescendant'?: string;
        /** Indicates whether assistive technologies will present all, or only parts of, the changed region based on the change notifications defined by the aria-relevant attribute. */
        'aria-atomic'?: boolean | 'false' | 'true';
        /**
         * Indicates whether inputting text could trigger display of one or more predictions of the user's intended value for an input and specifies how predictions would be
         * presented if they are made.
         */
        'aria-autocomplete'?: 'none' | 'inline' | 'list' | 'both';
        /** Indicates an element is being modified and that assistive technologies MAY want to wait until the modifications are complete before exposing them to the user. */
        'aria-busy'?: boolean | 'false' | 'true';
        /**
         * Indicates the current "checked" state of checkboxes, radio buttons, and other widgets.
         * @see aria-pressed @see aria-selected.
         */
        'aria-checked'?: boolean | 'false' | 'mixed' | 'true';
        /**
         * Defines the total number of columns in a table, grid, or treegrid.
         * @see aria-colindex.
         */
        'aria-colcount'?: number;
        /**
         * Defines an element's column index or position with respect to the total number of columns within a table, grid, or treegrid.
         * @see aria-colcount @see aria-colspan.
         */
        'aria-colindex'?: number;
        /**
         * Defines the number of columns spanned by a cell or gridcell within a table, grid, or treegrid.
         * @see aria-colindex @see aria-rowspan.
         */
        'aria-colspan'?: number;
        /**
         * Identifies the element (or elements) whose contents or presence are controlled by the current element.
         * @see aria-owns.
         */
        'aria-controls'?: string;
        /** Indicates the element that represents the current item within a container or set of related elements. */
        'aria-current'?: boolean | 'false' | 'true' | 'page' | 'step' | 'location' | 'date' | 'time';
        /**
         * Identifies the element (or elements) that describes the object.
         * @see aria-labelledby
         */
        'aria-describedby'?: string;
        /**
         * Identifies the element that provides a detailed, extended description for the object.
         * @see aria-describedby.
         */
        'aria-details'?: string;
        /**
         * Indicates that the element is perceivable but disabled, so it is not editable or otherwise operable.
         * @see aria-hidden @see aria-readonly.
         */
        'aria-disabled'?: boolean | 'false' | 'true';
        /**
         * Indicates what functions can be performed when a dragged object is released on the drop target.
         * @deprecated in ARIA 1.1
         */
        'aria-dropeffect'?: 'none' | 'copy' | 'execute' | 'link' | 'move' | 'popup';
        /**
         * Identifies the element that provides an error message for the object.
         * @see aria-invalid @see aria-describedby.
         */
        'aria-errormessage'?: string;
        /** Indicates whether the element, or another grouping element it controls, is currently expanded or collapsed. */
        'aria-expanded'?: boolean | 'false' | 'true';
        /**
         * Identifies the next element (or elements) in an alternate reading order of content which, at the user's discretion,
         * allows assistive technology to override the general default of reading in document source order.
         */
        'aria-flowto'?: string;
        /**
         * Indicates an element's "grabbed" state in a drag-and-drop operation.
         * @deprecated in ARIA 1.1
         */
        'aria-grabbed'?: boolean | 'false' | 'true';
        /** Indicates the availability and type of interactive popup element, such as menu or dialog, that can be triggered by an element. */
        'aria-haspopup'?: boolean | 'false' | 'true' | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
        /**
         * Indicates whether the element is exposed to an accessibility API.
         * @see aria-disabled.
         */
        'aria-hidden'?: boolean | 'false' | 'true';
        /**
         * Indicates the entered value does not conform to the format expected by the application.
         * @see aria-errormessage.
         */
        'aria-invalid'?: boolean | 'false' | 'true' | 'grammar' | 'spelling';
        /** Indicates keyboard shortcuts that an author has implemented to activate or give focus to an element. */
        'aria-keyshortcuts'?: string;
        /**
         * Defines a string value that labels the current element.
         * @see aria-labelledby.
         */
        'aria-label'?: string;
        /**
         * Identifies the element (or elements) that labels the current element.
         * @see aria-describedby.
         */
        'aria-labelledby'?: string;
        /** Defines the hierarchical level of an element within a structure. */
        'aria-level'?: number;
        /** Indicates that an element will be updated, and describes the types of updates the user agents, assistive technologies, and user can expect from the live region. */
        'aria-live'?: 'off' | 'assertive' | 'polite';
        /** Indicates whether an element is modal when displayed. */
        'aria-modal'?: boolean | 'false' | 'true';
        /** Indicates whether a text box accepts multiple lines of input or only a single line. */
        'aria-multiline'?: boolean | 'false' | 'true';
        /** Indicates that the user may select more than one item from the current selectable descendants. */
        'aria-multiselectable'?: boolean | 'false' | 'true';
        /** Indicates whether the element's orientation is horizontal, vertical, or unknown/ambiguous. */
        'aria-orientation'?: 'horizontal' | 'vertical';
        /**
         * Identifies an element (or elements) in order to define a visual, functional, or contextual parent/child relationship
         * between DOM elements where the DOM hierarchy cannot be used to represent the relationship.
         * @see aria-controls.
         */
        'aria-owns'?: string;
        /**
         * Defines a short hint (a word or short phrase) intended to aid the user with data entry when the control has no value.
         * A hint could be a sample value or a brief description of the expected format.
         */
        'aria-placeholder'?: string;
        /**
         * Defines an element's number or position in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM.
         * @see aria-setsize.
         */
        'aria-posinset'?: number;
        /**
         * Indicates the current "pressed" state of toggle buttons.
         * @see aria-checked @see aria-selected.
         */
        'aria-pressed'?: boolean | 'false' | 'mixed' | 'true';
        /**
         * Indicates that the element is not editable, but is otherwise operable.
         * @see aria-disabled.
         */
        'aria-readonly'?: boolean | 'false' | 'true';
        /**
         * Indicates what notifications the user agent will trigger when the accessibility tree within a live region is modified.
         * @see aria-atomic.
         */
        'aria-relevant'?: 'additions' | 'additions text' | 'all' | 'removals' | 'text';
        /** Indicates that user input is required on the element before a form may be submitted. */
        'aria-required'?: boolean | 'false' | 'true';
        /** Defines a human-readable, author-localized description for the role of an element. */
        'aria-roledescription'?: string;
        /**
         * Defines the total number of rows in a table, grid, or treegrid.
         * @see aria-rowindex.
         */
        'aria-rowcount'?: number;
        /**
         * Defines an element's row index or position with respect to the total number of rows within a table, grid, or treegrid.
         * @see aria-rowcount @see aria-rowspan.
         */
        'aria-rowindex'?: number;
        /**
         * Defines the number of rows spanned by a cell or gridcell within a table, grid, or treegrid.
         * @see aria-rowindex @see aria-colspan.
         */
        'aria-rowspan'?: number;
        /**
         * Indicates the current "selected" state of various widgets.
         * @see aria-checked @see aria-pressed.
         */
        'aria-selected'?: boolean | 'false' | 'true';
        /**
         * Defines the number of items in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM.
         * @see aria-posinset.
         */
        'aria-setsize'?: number;
        /** Indicates if items in a table or grid are sorted in ascending or descending order. */
        'aria-sort'?: 'none' | 'ascending' | 'descending' | 'other';
        /** Defines the maximum allowed value for a range widget. */
        'aria-valuemax'?: number;
        /** Defines the minimum allowed value for a range widget. */
        'aria-valuemin'?: number;
        /**
         * Defines the current value for a range widget.
         * @see aria-valuetext.
         */
        'aria-valuenow'?: number;
        /** Defines the human readable text alternative of aria-valuenow for a range widget. */
        'aria-valuetext'?: string;
    }

    interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
        // Standard HTML Attributes
        accessKey?: string;
        class?: Class;
        contentEditable?: boolean;
        contextMenu?: string;
        dir?: string;
        draggable?: boolean;
        hidden?: boolean;
        id?: string;
        lang?: string;
        placeholder?: string;
        slot?: string;
        spellCheck?: boolean;
        style?: CSSProperties;
        tabIndex?: number;
        title?: string;

        // Unknown
        inputMode?: string;
        is?: string;
        radioGroup?: string; // <command>, <menuitem>

        // WAI-ARIA
        role?: string;

        // RDFa Attributes
        about?: string;
        datatype?: string;
        inlist?: any;
        prefix?: string;
        property?: string;
        resource?: string;
        typeof?: string;
        vocab?: string;

        // Non-standard Attributes
        autoCapitalize?: string;
        autoCorrect?: string;
        autoSave?: string;
        color?: string;
        itemProp?: string;
        itemScope?: boolean;
        itemType?: string;
        itemID?: string;
        itemRef?: string;
        results?: number;
        security?: string;
        unselectable?: 'on' | 'off';
    }

    interface AllHTMLAttributes<T> extends HTMLAttributes<T> {
        // Standard HTML Attributes
        accept?: string;
        acceptCharset?: string;
        action?: string;
        allowFullScreen?: boolean;
        allowTransparency?: boolean;
        alt?: string;
        as?: string;
        async?: boolean;
        autoComplete?: string;
        autoFocus?: boolean;
        autoPlay?: boolean;
        capture?: boolean | string;
        cellPadding?: number | string;
        cellSpacing?: number | string;
        charSet?: string;
        challenge?: string;
        checked?: boolean;
        cite?: string;
        classID?: string;
        cols?: number;
        colSpan?: number;
        content?: string;
        controls?: boolean;
        coords?: string;
        crossOrigin?: string;
        data?: string;
        dateTime?: string;
        default?: boolean;
        defer?: boolean;
        disabled?: boolean;
        download?: any;
        encType?: string;
        form?: string;
        formAction?: string;
        formEncType?: string;
        formMethod?: string;
        formNoValidate?: boolean;
        formTarget?: string;
        frameBorder?: number | string;
        headers?: string;
        height?: number | string;
        high?: number;
        href?: string;
        hrefLang?: string;
        htmlFor?: string;
        httpEquiv?: string;
        integrity?: string;
        keyParams?: string;
        keyType?: string;
        kind?: string;
        label?: string;
        list?: string;
        loop?: boolean;
        low?: number;
        manifest?: string;
        marginHeight?: number;
        marginWidth?: number;
        max?: number | string;
        maxLength?: number;
        media?: string;
        mediaGroup?: string;
        method?: string;
        min?: number | string;
        minLength?: number;
        multiple?: boolean;
        muted?: boolean;
        name?: string;
        nonce?: string;
        noValidate?: boolean;
        open?: boolean;
        optimum?: number;
        pattern?: string;
        placeholder?: string;
        playsInline?: boolean;
        poster?: string;
        preload?: string;
        readOnly?: boolean;
        rel?: string;
        required?: boolean;
        reversed?: boolean;
        rows?: number;
        rowSpan?: number;
        sandbox?: string;
        scope?: string;
        scoped?: boolean;
        scrolling?: string;
        seamless?: boolean;
        selected?: boolean;
        shape?: string;
        size?: number;
        sizes?: string;
        span?: number;
        src?: string;
        srcDoc?: string;
        srcLang?: string;
        srcSet?: string;
        start?: number;
        step?: number | string;
        summary?: string;
        target?: string;
        type?: string;
        useMap?: string;
        value?: string | string[] | number;
        width?: number | string;
        wmode?: string;
        wrap?: string;
    }

    interface AnchorHTMLAttributes<T> extends HTMLAttributes<T> {
        download?: any;
        href?: string;
        hrefLang?: string;
        media?: string;
        ping?: string;
        rel?: string;
        target?: string;
        type?: string;
        referrerPolicy?: string;
    }

    // tslint:disable-next-line:no-empty-interface
    interface AudioHTMLAttributes<T> extends MediaHTMLAttributes<T> { }

    interface AreaHTMLAttributes<T> extends HTMLAttributes<T> {
        alt?: string;
        coords?: string;
        download?: any;
        href?: string;
        hrefLang?: string;
        media?: string;
        rel?: string;
        shape?: string;
        target?: string;
    }

    interface BaseHTMLAttributes<T> extends HTMLAttributes<T> {
        href?: string;
        target?: string;
    }

    interface BlockquoteHTMLAttributes<T> extends HTMLAttributes<T> {
        cite?: string;
    }

    interface ButtonHTMLAttributes<T> extends HTMLAttributes<T> {
        autoFocus?: boolean;
        disabled?: boolean;
        form?: string;
        formAction?: string;
        formEncType?: string;
        formMethod?: string;
        formNoValidate?: boolean;
        formTarget?: string;
        name?: string;
        type?: 'submit' | 'reset' | 'button';
        value?: string | string[] | number;
    }

    interface CanvasHTMLAttributes<T> extends HTMLAttributes<T> {
        height?: number | string;
        width?: number | string;
    }

    interface ColHTMLAttributes<T> extends HTMLAttributes<T> {
        span?: number;
        width?: number | string;
    }

    interface ColgroupHTMLAttributes<T> extends HTMLAttributes<T> {
        span?: number;
    }

    interface DataHTMLAttributes<T> extends HTMLAttributes<T> {
        value?: string | string[] | number;
    }

    interface DetailsHTMLAttributes<T> extends HTMLAttributes<T> {
        open?: boolean;
    }

    interface DelHTMLAttributes<T> extends HTMLAttributes<T> {
        cite?: string;
        dateTime?: string;
    }

    interface DialogHTMLAttributes<T> extends HTMLAttributes<T> {
        open?: boolean;
    }

    interface EmbedHTMLAttributes<T> extends HTMLAttributes<T> {
        height?: number | string;
        src?: string;
        type?: string;
        width?: number | string;
    }

    interface FieldsetHTMLAttributes<T> extends HTMLAttributes<T> {
        disabled?: boolean;
        form?: string;
        name?: string;
    }

    interface FormHTMLAttributes<T> extends HTMLAttributes<T> {
        acceptCharset?: string;
        action?: string;
        autoComplete?: string;
        encType?: string;
        method?: string;
        name?: string;
        noValidate?: boolean;
        target?: string;
    }

    interface HtmlHTMLAttributes<T> extends HTMLAttributes<T> {
        manifest?: string;
    }

    interface IframeHTMLAttributes<T> extends HTMLAttributes<T> {
        allow?: string;
        allowFullScreen?: boolean;
        allowTransparency?: boolean;
        frameBorder?: number | string;
        height?: number | string;
        marginHeight?: number;
        marginWidth?: number;
        name?: string;
        referrerPolicy?: string;
        sandbox?: string;
        scrolling?: string;
        seamless?: boolean;
        src?: string;
        srcDoc?: string;
        width?: number | string;
    }

    interface ImgHTMLAttributes<T> extends HTMLAttributes<T> {
        alt?: string;
        crossOrigin?: "anonymous" | "use-credentials" | "";
        decoding?: "async" | "auto" | "sync";
        height?: number | string;
        sizes?: string;
        src?: string;
        srcSet?: string;
        useMap?: string;
        width?: number | string;
    }

    interface InsHTMLAttributes<T> extends HTMLAttributes<T> {
        cite?: string;
        dateTime?: string;
    }

    interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
        accept?: string;
        alt?: string;
        autoComplete?: string;
        autoFocus?: boolean;
        capture?: boolean | string; // https://www.w3.org/TR/html-media-capture/#the-capture-attribute
        checked?: boolean;
        crossOrigin?: string;
        disabled?: boolean;
        form?: string;
        formAction?: string;
        formEncType?: string;
        formMethod?: string;
        formNoValidate?: boolean;
        formTarget?: string;
        height?: number | string;
        list?: string;
        max?: number | string;
        maxLength?: number;
        min?: number | string;
        minLength?: number;
        multiple?: boolean;
        name?: string;
        pattern?: string;
        placeholder?: string;
        readOnly?: boolean;
        required?: boolean;
        size?: number;
        src?: string;
        step?: number | string;
        type?: string;
        value?: string | string[] | number;
        width?: number | string;

        onChange?: ChangeEventHandler<T>;
    }

    interface KeygenHTMLAttributes<T> extends HTMLAttributes<T> {
        autoFocus?: boolean;
        challenge?: string;
        disabled?: boolean;
        form?: string;
        keyType?: string;
        keyParams?: string;
        name?: string;
    }

    interface LabelHTMLAttributes<T> extends HTMLAttributes<T> {
        form?: string;
        htmlFor?: string;
    }

    interface LiHTMLAttributes<T> extends HTMLAttributes<T> {
        value?: string | string[] | number;
    }

    interface LinkHTMLAttributes<T> extends HTMLAttributes<T> {
        as?: string;
        crossOrigin?: string;
        href?: string;
        hrefLang?: string;
        integrity?: string;
        media?: string;
        rel?: string;
        sizes?: string;
        type?: string;
    }

    interface MapHTMLAttributes<T> extends HTMLAttributes<T> {
        name?: string;
    }

    interface MenuHTMLAttributes<T> extends HTMLAttributes<T> {
        type?: string;
    }

    interface MediaHTMLAttributes<T> extends HTMLAttributes<T> {
        autoPlay?: boolean;
        controls?: boolean;
        controlsList?: string;
        crossOrigin?: string;
        loop?: boolean;
        mediaGroup?: string;
        muted?: boolean;
        playsinline?: boolean;
        preload?: string;
        src?: string;
    }

    interface MetaHTMLAttributes<T> extends HTMLAttributes<T> {
        charSet?: string;
        content?: string;
        httpEquiv?: string;
        name?: string;
    }

    interface MeterHTMLAttributes<T> extends HTMLAttributes<T> {
        form?: string;
        high?: number;
        low?: number;
        max?: number | string;
        min?: number | string;
        optimum?: number;
        value?: string | string[] | number;
    }

    interface QuoteHTMLAttributes<T> extends HTMLAttributes<T> {
        cite?: string;
    }

    interface ObjectHTMLAttributes<T> extends HTMLAttributes<T> {
        classID?: string;
        data?: string;
        form?: string;
        height?: number | string;
        name?: string;
        type?: string;
        useMap?: string;
        width?: number | string;
        wmode?: string;
    }

    interface OlHTMLAttributes<T> extends HTMLAttributes<T> {
        reversed?: boolean;
        start?: number;
        type?: '1' | 'a' | 'A' | 'i' | 'I';
    }

    interface OptgroupHTMLAttributes<T> extends HTMLAttributes<T> {
        disabled?: boolean;
        label?: string;
    }

    interface OptionHTMLAttributes<T> extends HTMLAttributes<T> {
        disabled?: boolean;
        label?: string;
        selected?: boolean;
        value?: string | string[] | number;
    }

    interface OutputHTMLAttributes<T> extends HTMLAttributes<T> {
        form?: string;
        htmlFor?: string;
        name?: string;
    }

    interface ParamHTMLAttributes<T> extends HTMLAttributes<T> {
        name?: string;
        value?: string | string[] | number;
    }

    interface ProgressHTMLAttributes<T> extends HTMLAttributes<T> {
        max?: number | string;
        value?: string | string[] | number;
    }

    interface ScriptHTMLAttributes<T> extends HTMLAttributes<T> {
        async?: boolean;
        charSet?: string;
        crossOrigin?: string;
        defer?: boolean;
        integrity?: string;
        noModule?: boolean;
        nonce?: string;
        src?: string;
        type?: string;
    }

    interface SelectHTMLAttributes<T> extends HTMLAttributes<T> {
        autoComplete?: string;
        autoFocus?: boolean;
        disabled?: boolean;
        form?: string;
        multiple?: boolean;
        name?: string;
        required?: boolean;
        size?: number;
        value?: string | string[] | number;
        onChange?: ChangeEventHandler<T>;
    }

    interface SourceHTMLAttributes<T> extends HTMLAttributes<T> {
        media?: string;
        sizes?: string;
        src?: string;
        srcSet?: string;
        type?: string;
    }

    interface StyleHTMLAttributes<T> extends HTMLAttributes<T> {
        media?: string;
        nonce?: string;
        scoped?: boolean;
        type?: string;
    }

    interface TableHTMLAttributes<T> extends HTMLAttributes<T> {
        cellPadding?: number | string;
        cellSpacing?: number | string;
        summary?: string;
    }

    interface TextareaHTMLAttributes<T> extends HTMLAttributes<T> {
        autoComplete?: string;
        autoFocus?: boolean;
        cols?: number;
        dirName?: string;
        disabled?: boolean;
        form?: string;
        maxLength?: number;
        minLength?: number;
        name?: string;
        placeholder?: string;
        readOnly?: boolean;
        required?: boolean;
        rows?: number;
        value?: string | string[] | number;
        wrap?: string;

        onChange?: ChangeEventHandler<T>;
    }

    interface TdHTMLAttributes<T> extends HTMLAttributes<T> {
        align?: "left" | "center" | "right" | "justify" | "char";
        colSpan?: number;
        headers?: string;
        rowSpan?: number;
        scope?: string;
        valign?: "top" | "middle" | "bottom" | "baseline";
    }

    interface ThHTMLAttributes<T> extends HTMLAttributes<T> {
        align?: "left" | "center" | "right" | "justify" | "char";
        colSpan?: number;
        headers?: string;
        rowSpan?: number;
        scope?: string;
    }

    interface TimeHTMLAttributes<T> extends HTMLAttributes<T> {
        dateTime?: string;
    }

    interface TrackHTMLAttributes<T> extends HTMLAttributes<T> {
        default?: boolean;
        kind?: string;
        label?: string;
        src?: string;
        srcLang?: string;
    }

    interface VideoHTMLAttributes<T> extends MediaHTMLAttributes<T> {
        height?: number | string;
        playsInline?: boolean;
        poster?: string;
        width?: number | string;
    }

    // this list is "complete" in that it contains every SVG attribute
    // that React supports, but the types can be improved.
    // Full list here: https://facebook.github.io/react/docs/dom-elements.html
    //
    // The three broad type categories are (in order of restrictiveness):
    //   - "number | string"
    //   - "string"
    //   - union of string literals
    interface SVGAttributes<T> extends AriaAttributes, DOMAttributes<T> {
        // Attributes which also defined in HTMLAttributes
        // See comment in SVGDOMPropertyConfig.js
        class?: Class;
        color?: string;
        height?: number | string;
        id?: string;
        lang?: string;
        max?: number | string;
        media?: string;
        method?: string;
        min?: number | string;
        name?: string;
        style?: CSSProperties;
        target?: string;
        type?: string;
        width?: number | string;

        // Other HTML properties supported by SVG elements in browsers
        role?: string;
        tabIndex?: number;

        // SVG Specific attributes
        accentHeight?: number | string;
        accumulate?: "none" | "sum";
        additive?: "replace" | "sum";
        alignmentBaseline?: "auto" | "baseline" | "before-edge" | "text-before-edge" | "middle" | "central" | "after-edge" |
        "text-after-edge" | "ideographic" | "alphabetic" | "hanging" | "mathematical" | "inherit";
        allowReorder?: "no" | "yes";
        alphabetic?: number | string;
        amplitude?: number | string;
        arabicForm?: "initial" | "medial" | "terminal" | "isolated";
        ascent?: number | string;
        attributeName?: string;
        attributeType?: string;
        autoReverse?: number | string;
        azimuth?: number | string;
        baseFrequency?: number | string;
        baselineShift?: number | string;
        baseProfile?: number | string;
        bbox?: number | string;
        begin?: number | string;
        bias?: number | string;
        by?: number | string;
        calcMode?: number | string;
        capHeight?: number | string;
        clip?: number | string;
        clipPath?: string;
        clipPathUnits?: number | string;
        clipRule?: number | string;
        colorInterpolation?: number | string;
        colorInterpolationFilters?: "auto" | "sRGB" | "linearRGB" | "inherit";
        colorProfile?: number | string;
        colorRendering?: number | string;
        contentScriptType?: number | string;
        contentStyleType?: number | string;
        cursor?: number | string;
        cx?: number | string;
        cy?: number | string;
        d?: string;
        decelerate?: number | string;
        descent?: number | string;
        diffuseConstant?: number | string;
        direction?: number | string;
        display?: number | string;
        divisor?: number | string;
        dominantBaseline?: number | string;
        dur?: number | string;
        dx?: number | string;
        dy?: number | string;
        edgeMode?: number | string;
        elevation?: number | string;
        enableBackground?: number | string;
        end?: number | string;
        exponent?: number | string;
        externalResourcesRequired?: number | string;
        fill?: string;
        fillOpacity?: number | string;
        fillRule?: "nonzero" | "evenodd" | "inherit";
        filter?: string;
        filterRes?: number | string;
        filterUnits?: number | string;
        floodColor?: number | string;
        floodOpacity?: number | string;
        focusable?: number | string;
        fontFamily?: string;
        fontSize?: number | string;
        fontSizeAdjust?: number | string;
        fontStretch?: number | string;
        fontStyle?: number | string;
        fontVariant?: number | string;
        fontWeight?: number | string;
        format?: number | string;
        from?: number | string;
        fx?: number | string;
        fy?: number | string;
        g1?: number | string;
        g2?: number | string;
        glyphName?: number | string;
        glyphOrientationHorizontal?: number | string;
        glyphOrientationVertical?: number | string;
        glyphRef?: number | string;
        gradientTransform?: string;
        gradientUnits?: string;
        hanging?: number | string;
        horizAdvX?: number | string;
        horizOriginX?: number | string;
        href?: string;
        ideographic?: number | string;
        imageRendering?: number | string;
        in2?: number | string;
        in?: string;
        intercept?: number | string;
        k1?: number | string;
        k2?: number | string;
        k3?: number | string;
        k4?: number | string;
        k?: number | string;
        kernelMatrix?: number | string;
        kernelUnitLength?: number | string;
        kerning?: number | string;
        keyPoints?: number | string;
        keySplines?: number | string;
        keyTimes?: number | string;
        lengthAdjust?: number | string;
        letterSpacing?: number | string;
        lightingColor?: number | string;
        limitingConeAngle?: number | string;
        local?: number | string;
        markerEnd?: string;
        markerHeight?: number | string;
        markerMid?: string;
        markerStart?: string;
        markerUnits?: number | string;
        markerWidth?: number | string;
        mask?: string;
        maskContentUnits?: number | string;
        maskUnits?: number | string;
        mathematical?: number | string;
        mode?: number | string;
        numOctaves?: number | string;
        offset?: number | string;
        opacity?: number | string;
        operator?: number | string;
        order?: number | string;
        orient?: number | string;
        orientation?: number | string;
        origin?: number | string;
        overflow?: number | string;
        overlinePosition?: number | string;
        overlineThickness?: number | string;
        paintOrder?: number | string;
        panose1?: number | string;
        pathLength?: number | string;
        patternContentUnits?: string;
        patternTransform?: number | string;
        patternUnits?: string;
        pointerEvents?: number | string;
        points?: string;
        pointsAtX?: number | string;
        pointsAtY?: number | string;
        pointsAtZ?: number | string;
        preserveAlpha?: number | string;
        preserveAspectRatio?: string;
        primitiveUnits?: number | string;
        r?: number | string;
        radius?: number | string;
        refX?: number | string;
        refY?: number | string;
        renderingIntent?: number | string;
        repeatCount?: number | string;
        repeatDur?: number | string;
        requiredExtensions?: number | string;
        requiredFeatures?: number | string;
        restart?: number | string;
        result?: string;
        rotate?: number | string;
        rx?: number | string;
        ry?: number | string;
        scale?: number | string;
        seed?: number | string;
        shapeRendering?: number | string;
        slope?: number | string;
        spacing?: number | string;
        specularConstant?: number | string;
        specularExponent?: number | string;
        speed?: number | string;
        spreadMethod?: string;
        startOffset?: number | string;
        stdDeviation?: number | string;
        stemh?: number | string;
        stemv?: number | string;
        stitchTiles?: number | string;
        stopColor?: string;
        stopOpacity?: number | string;
        strikethroughPosition?: number | string;
        strikethroughThickness?: number | string;
        string?: number | string;
        stroke?: string;
        strokeDasharray?: string | number;
        strokeDashoffset?: string | number;
        strokeLinecap?: "butt" | "round" | "square" | "inherit";
        strokeLinejoin?: "miter" | "round" | "bevel" | "inherit";
        strokeMiterlimit?: number | string;
        strokeOpacity?: number | string;
        strokeWidth?: number | string;
        surfaceScale?: number | string;
        systemLanguage?: number | string;
        tableValues?: number | string;
        targetX?: number | string;
        targetY?: number | string;
        textAnchor?: string;
        textDecoration?: number | string;
        textLength?: number | string;
        textRendering?: number | string;
        to?: number | string;
        transform?: string;
        u1?: number | string;
        u2?: number | string;
        underlinePosition?: number | string;
        underlineThickness?: number | string;
        unicode?: number | string;
        unicodeBidi?: number | string;
        unicodeRange?: number | string;
        unitsPerEm?: number | string;
        vAlphabetic?: number | string;
        values?: string;
        vectorEffect?: number | string;
        version?: string;
        vertAdvY?: number | string;
        vertOriginX?: number | string;
        vertOriginY?: number | string;
        vHanging?: number | string;
        vIdeographic?: number | string;
        viewBox?: string;
        viewTarget?: number | string;
        visibility?: number | string;
        vMathematical?: number | string;
        widths?: number | string;
        wordSpacing?: number | string;
        writingMode?: number | string;
        x1?: number | string;
        x2?: number | string;
        x?: number | string;
        xChannelSelector?: string;
        xHeight?: number | string;
        xlinkActuate?: string;
        xlinkArcrole?: string;
        xlinkHref?: string;
        xlinkRole?: string;
        xlinkShow?: string;
        xlinkTitle?: string;
        xlinkType?: string;
        xmlBase?: string;
        xmlLang?: string;
        xmlns?: string;
        xmlnsXlink?: string;
        xmlSpace?: string;
        y1?: number | string;
        y2?: number | string;
        y?: number | string;
        yChannelSelector?: string;
        z?: number | string;
        zoomAndPan?: string;
    }

    interface WebViewHTMLAttributes<T> extends HTMLAttributes<T> {
        allowFullScreen?: boolean;
        allowpopups?: boolean;
        autoFocus?: boolean;
        autosize?: boolean;
        blinkfeatures?: string;
        disableblinkfeatures?: string;
        disableguestresize?: boolean;
        disablewebsecurity?: boolean;
        guestinstance?: string;
        httpreferrer?: string;
        nodeintegration?: boolean;
        partition?: string;
        plugins?: boolean;
        preload?: string;
        src?: string;
        useragent?: string;
        webpreferences?: string;
    }
}

declare global {
    interface Element {
        readonly style: CSSStyleDeclaration
        actions?: { [key: string]: Function }
    }

    namespace JSX {
        // tslint:disable-next-line:no-empty-interface
        interface Element extends VNode<any> { }

        interface IntrinsicElements {
            // HTML
            a: Typerapp.DetailedHTMLProps<Typerapp.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;
            abbr: Typerapp.DetailedHTMLProps<Typerapp.HTMLAttributes<HTMLElement>, HTMLElement>;
            address: Typerapp.DetailedHTMLProps<Typerapp.HTMLAttributes<HTMLElement>, HTMLElement>;
            area: Typerapp.DetailedHTMLProps<Typerapp.AreaHTMLAttributes<HTMLAreaElement>, HTMLAreaElement>;
            article: Typerapp.DetailedHTMLProps<Typerapp.HTMLAttributes<HTMLElement>, HTMLElement>;
            aside: Typerapp.DetailedHTMLProps<Typerapp.HTMLAttributes<HTMLElement>, HTMLElement>;
            audio: Typerapp.DetailedHTMLProps<Typerapp.AudioHTMLAttributes<HTMLAudioElement>, HTMLAudioElement>;
            b: Typerapp.DetailedHTMLProps<Typerapp.HTMLAttributes<HTMLElement>, HTMLElement>;
            base: Typerapp.DetailedHTMLProps<Typerapp.BaseHTMLAttributes<HTMLBaseElement>, HTMLBaseElement>;
            bdi: Typerapp.DetailedHTMLProps<Typerapp.HTMLAttributes<HTMLElement>, HTMLElement>;
            bdo: Typerapp.DetailedHTMLProps<Typerapp.HTMLAttributes<HTMLElement>, HTMLElement>;
            big: Typerapp.DetailedHTMLProps<Typerapp.HTMLAttributes<HTMLElement>, HTMLElement>;
            blockquote: Typerapp.DetailedHTMLProps<Typerapp.BlockquoteHTMLAttributes<HTMLElement>, HTMLElement>;
            body: Typerapp.DetailedHTMLProps<Typerapp.HTMLAttributes<HTMLBodyElement>, HTMLBodyElement>;
            br: Typerapp.DetailedHTMLProps<Typerapp.HTMLAttributes<HTMLBRElement>, HTMLBRElement>;
            button: Typerapp.DetailedHTMLProps<Typerapp.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
            canvas: Typerapp.DetailedHTMLProps<Typerapp.CanvasHTMLAttributes<HTMLCanvasElement>, HTMLCanvasElement>;
            caption: Typerapp.DetailedHTMLProps<Typerapp.HTMLAttributes<HTMLElement>, HTMLElement>;
            cite: Typerapp.DetailedHTMLProps<Typerapp.HTMLAttributes<HTMLElement>, HTMLElement>;
            code: Typerapp.DetailedHTMLProps<Typerapp.HTMLAttributes<HTMLElement>, HTMLElement>;
            col: Typerapp.DetailedHTMLProps<Typerapp.ColHTMLAttributes<HTMLTableColElement>, HTMLTableColElement>;
            colgroup: Typerapp.DetailedHTMLProps<Typerapp.ColgroupHTMLAttributes<HTMLTableColElement>, HTMLTableColElement>;
            data: Typerapp.DetailedHTMLProps<Typerapp.DataHTMLAttributes<HTMLDataElement>, HTMLDataElement>;
            datalist: Typerapp.DetailedHTMLProps<Typerapp.HTMLAttributes<HTMLDataListElement>, HTMLDataListElement>;
            dd: Typerapp.DetailedHTMLProps<Typerapp.HTMLAttributes<HTMLElement>, HTMLElement>;
            del: Typerapp.DetailedHTMLProps<Typerapp.DelHTMLAttributes<HTMLElement>, HTMLElement>;
            details: Typerapp.DetailedHTMLProps<Typerapp.DetailsHTMLAttributes<HTMLElement>, HTMLElement>;
            dfn: Typerapp.DetailedHTMLProps<Typerapp.HTMLAttributes<HTMLElement>, HTMLElement>;
            dialog: Typerapp.DetailedHTMLProps<Typerapp.DialogHTMLAttributes<HTMLDialogElement>, HTMLDialogElement>;
            div: Typerapp.DetailedHTMLProps<Typerapp.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
            dl: Typerapp.DetailedHTMLProps<Typerapp.HTMLAttributes<HTMLDListElement>, HTMLDListElement>;
            dt: Typerapp.DetailedHTMLProps<Typerapp.HTMLAttributes<HTMLElement>, HTMLElement>;
            em: Typerapp.DetailedHTMLProps<Typerapp.HTMLAttributes<HTMLElement>, HTMLElement>;
            embed: Typerapp.DetailedHTMLProps<Typerapp.EmbedHTMLAttributes<HTMLEmbedElement>, HTMLEmbedElement>;
            fieldset: Typerapp.DetailedHTMLProps<Typerapp.FieldsetHTMLAttributes<HTMLFieldSetElement>, HTMLFieldSetElement>;
            figcaption: Typerapp.DetailedHTMLProps<Typerapp.HTMLAttributes<HTMLElement>, HTMLElement>;
            figure: Typerapp.DetailedHTMLProps<Typerapp.HTMLAttributes<HTMLElement>, HTMLElement>;
            footer: Typerapp.DetailedHTMLProps<Typerapp.HTMLAttributes<HTMLElement>, HTMLElement>;
            form: Typerapp.DetailedHTMLProps<Typerapp.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>;
            h1: Typerapp.DetailedHTMLProps<Typerapp.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
            h2: Typerapp.DetailedHTMLProps<Typerapp.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
            h3: Typerapp.DetailedHTMLProps<Typerapp.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
            h4: Typerapp.DetailedHTMLProps<Typerapp.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
            h5: Typerapp.DetailedHTMLProps<Typerapp.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
            h6: Typerapp.DetailedHTMLProps<Typerapp.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
            head: Typerapp.DetailedHTMLProps<Typerapp.HTMLAttributes<HTMLHeadElement>, HTMLHeadElement>;
            header: Typerapp.DetailedHTMLProps<Typerapp.HTMLAttributes<HTMLElement>, HTMLElement>;
            hgroup: Typerapp.DetailedHTMLProps<Typerapp.HTMLAttributes<HTMLElement>, HTMLElement>;
            hr: Typerapp.DetailedHTMLProps<Typerapp.HTMLAttributes<HTMLHRElement>, HTMLHRElement>;
            html: Typerapp.DetailedHTMLProps<Typerapp.HtmlHTMLAttributes<HTMLHtmlElement>, HTMLHtmlElement>;
            i: Typerapp.DetailedHTMLProps<Typerapp.HTMLAttributes<HTMLElement>, HTMLElement>;
            iframe: Typerapp.DetailedHTMLProps<Typerapp.IframeHTMLAttributes<HTMLIFrameElement>, HTMLIFrameElement>;
            img: Typerapp.DetailedHTMLProps<Typerapp.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>;
            input: Typerapp.DetailedHTMLProps<Typerapp.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
            ins: Typerapp.DetailedHTMLProps<Typerapp.InsHTMLAttributes<HTMLModElement>, HTMLModElement>;
            kbd: Typerapp.DetailedHTMLProps<Typerapp.HTMLAttributes<HTMLElement>, HTMLElement>;
            keygen: Typerapp.DetailedHTMLProps<Typerapp.KeygenHTMLAttributes<HTMLElement>, HTMLElement>;
            label: Typerapp.DetailedHTMLProps<Typerapp.LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>;
            legend: Typerapp.DetailedHTMLProps<Typerapp.HTMLAttributes<HTMLLegendElement>, HTMLLegendElement>;
            li: Typerapp.DetailedHTMLProps<Typerapp.LiHTMLAttributes<HTMLLIElement>, HTMLLIElement>;
            link: Typerapp.DetailedHTMLProps<Typerapp.LinkHTMLAttributes<HTMLLinkElement>, HTMLLinkElement>;
            main: Typerapp.DetailedHTMLProps<Typerapp.HTMLAttributes<HTMLElement>, HTMLElement>;
            map: Typerapp.DetailedHTMLProps<Typerapp.MapHTMLAttributes<HTMLMapElement>, HTMLMapElement>;
            mark: Typerapp.DetailedHTMLProps<Typerapp.HTMLAttributes<HTMLElement>, HTMLElement>;
            menu: Typerapp.DetailedHTMLProps<Typerapp.MenuHTMLAttributes<HTMLElement>, HTMLElement>;
            menuitem: Typerapp.DetailedHTMLProps<Typerapp.HTMLAttributes<HTMLElement>, HTMLElement>;
            meta: Typerapp.DetailedHTMLProps<Typerapp.MetaHTMLAttributes<HTMLMetaElement>, HTMLMetaElement>;
            meter: Typerapp.DetailedHTMLProps<Typerapp.MeterHTMLAttributes<HTMLElement>, HTMLElement>;
            nav: Typerapp.DetailedHTMLProps<Typerapp.HTMLAttributes<HTMLElement>, HTMLElement>;
            noindex: Typerapp.DetailedHTMLProps<Typerapp.HTMLAttributes<HTMLElement>, HTMLElement>;
            noscript: Typerapp.DetailedHTMLProps<Typerapp.HTMLAttributes<HTMLElement>, HTMLElement>;
            object: Typerapp.DetailedHTMLProps<Typerapp.ObjectHTMLAttributes<HTMLObjectElement>, HTMLObjectElement>;
            ol: Typerapp.DetailedHTMLProps<Typerapp.OlHTMLAttributes<HTMLOListElement>, HTMLOListElement>;
            optgroup: Typerapp.DetailedHTMLProps<Typerapp.OptgroupHTMLAttributes<HTMLOptGroupElement>, HTMLOptGroupElement>;
            option: Typerapp.DetailedHTMLProps<Typerapp.OptionHTMLAttributes<HTMLOptionElement>, HTMLOptionElement>;
            output: Typerapp.DetailedHTMLProps<Typerapp.OutputHTMLAttributes<HTMLElement>, HTMLElement>;
            p: Typerapp.DetailedHTMLProps<Typerapp.HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>;
            param: Typerapp.DetailedHTMLProps<Typerapp.ParamHTMLAttributes<HTMLParamElement>, HTMLParamElement>;
            picture: Typerapp.DetailedHTMLProps<Typerapp.HTMLAttributes<HTMLElement>, HTMLElement>;
            pre: Typerapp.DetailedHTMLProps<Typerapp.HTMLAttributes<HTMLPreElement>, HTMLPreElement>;
            progress: Typerapp.DetailedHTMLProps<Typerapp.ProgressHTMLAttributes<HTMLProgressElement>, HTMLProgressElement>;
            q: Typerapp.DetailedHTMLProps<Typerapp.QuoteHTMLAttributes<HTMLQuoteElement>, HTMLQuoteElement>;
            rp: Typerapp.DetailedHTMLProps<Typerapp.HTMLAttributes<HTMLElement>, HTMLElement>;
            rt: Typerapp.DetailedHTMLProps<Typerapp.HTMLAttributes<HTMLElement>, HTMLElement>;
            ruby: Typerapp.DetailedHTMLProps<Typerapp.HTMLAttributes<HTMLElement>, HTMLElement>;
            s: Typerapp.DetailedHTMLProps<Typerapp.HTMLAttributes<HTMLElement>, HTMLElement>;
            samp: Typerapp.DetailedHTMLProps<Typerapp.HTMLAttributes<HTMLElement>, HTMLElement>;
            script: Typerapp.DetailedHTMLProps<Typerapp.ScriptHTMLAttributes<HTMLScriptElement>, HTMLScriptElement>;
            section: Typerapp.DetailedHTMLProps<Typerapp.HTMLAttributes<HTMLElement>, HTMLElement>;
            select: Typerapp.DetailedHTMLProps<Typerapp.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>;
            small: Typerapp.DetailedHTMLProps<Typerapp.HTMLAttributes<HTMLElement>, HTMLElement>;
            source: Typerapp.DetailedHTMLProps<Typerapp.SourceHTMLAttributes<HTMLSourceElement>, HTMLSourceElement>;
            span: Typerapp.DetailedHTMLProps<Typerapp.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;
            strong: Typerapp.DetailedHTMLProps<Typerapp.HTMLAttributes<HTMLElement>, HTMLElement>;
            style: Typerapp.DetailedHTMLProps<Typerapp.StyleHTMLAttributes<HTMLStyleElement>, HTMLStyleElement>;
            sub: Typerapp.DetailedHTMLProps<Typerapp.HTMLAttributes<HTMLElement>, HTMLElement>;
            summary: Typerapp.DetailedHTMLProps<Typerapp.HTMLAttributes<HTMLElement>, HTMLElement>;
            sup: Typerapp.DetailedHTMLProps<Typerapp.HTMLAttributes<HTMLElement>, HTMLElement>;
            table: Typerapp.DetailedHTMLProps<Typerapp.TableHTMLAttributes<HTMLTableElement>, HTMLTableElement>;
            template: Typerapp.DetailedHTMLProps<Typerapp.HTMLAttributes<HTMLTemplateElement>, HTMLTemplateElement>;
            tbody: Typerapp.DetailedHTMLProps<Typerapp.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>;
            td: Typerapp.DetailedHTMLProps<Typerapp.TdHTMLAttributes<HTMLTableDataCellElement>, HTMLTableDataCellElement>;
            textarea: Typerapp.DetailedHTMLProps<Typerapp.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>;
            tfoot: Typerapp.DetailedHTMLProps<Typerapp.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>;
            th: Typerapp.DetailedHTMLProps<Typerapp.ThHTMLAttributes<HTMLTableHeaderCellElement>, HTMLTableHeaderCellElement>;
            thead: Typerapp.DetailedHTMLProps<Typerapp.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>;
            time: Typerapp.DetailedHTMLProps<Typerapp.TimeHTMLAttributes<HTMLElement>, HTMLElement>;
            title: Typerapp.DetailedHTMLProps<Typerapp.HTMLAttributes<HTMLTitleElement>, HTMLTitleElement>;
            tr: Typerapp.DetailedHTMLProps<Typerapp.HTMLAttributes<HTMLTableRowElement>, HTMLTableRowElement>;
            track: Typerapp.DetailedHTMLProps<Typerapp.TrackHTMLAttributes<HTMLTrackElement>, HTMLTrackElement>;
            u: Typerapp.DetailedHTMLProps<Typerapp.HTMLAttributes<HTMLElement>, HTMLElement>;
            ul: Typerapp.DetailedHTMLProps<Typerapp.HTMLAttributes<HTMLUListElement>, HTMLUListElement>;
            "var": Typerapp.DetailedHTMLProps<Typerapp.HTMLAttributes<HTMLElement>, HTMLElement>;
            video: Typerapp.DetailedHTMLProps<Typerapp.VideoHTMLAttributes<HTMLVideoElement>, HTMLVideoElement>;
            wbr: Typerapp.DetailedHTMLProps<Typerapp.HTMLAttributes<HTMLElement>, HTMLElement>;
            webview: Typerapp.DetailedHTMLProps<Typerapp.WebViewHTMLAttributes<HTMLWebViewElement>, HTMLWebViewElement>;

            // SVG
            svg: Typerapp.SVGProps<SVGSVGElement>;

            animate: Typerapp.SVGProps<SVGElement>; // TODO: It is SVGAnimateElement but is not in TypeScript's lib.dom.d.ts for now.
            animateMotion: Typerapp.SVGProps<SVGElement>;
            animateTransform: Typerapp.SVGProps<SVGElement>; // TODO: It is SVGAnimateTransformElement but is not in TypeScript's lib.dom.d.ts for now.
            mpath: Typerapp.SVGProps<SVGElement>;
            circle: Typerapp.SVGProps<SVGCircleElement>;
            clipPath: Typerapp.SVGProps<SVGClipPathElement>;
            defs: Typerapp.SVGProps<SVGDefsElement>;
            desc: Typerapp.SVGProps<SVGDescElement>;
            ellipse: Typerapp.SVGProps<SVGEllipseElement>;
            feBlend: Typerapp.SVGProps<SVGFEBlendElement>;
            feColorMatrix: Typerapp.SVGProps<SVGFEColorMatrixElement>;
            feComponentTransfer: Typerapp.SVGProps<SVGFEComponentTransferElement>;
            feComposite: Typerapp.SVGProps<SVGFECompositeElement>;
            feConvolveMatrix: Typerapp.SVGProps<SVGFEConvolveMatrixElement>;
            feDiffuseLighting: Typerapp.SVGProps<SVGFEDiffuseLightingElement>;
            feDisplacementMap: Typerapp.SVGProps<SVGFEDisplacementMapElement>;
            feDistantLight: Typerapp.SVGProps<SVGFEDistantLightElement>;
            feDropShadow: Typerapp.SVGProps<SVGFEDropShadowElement>;
            feFlood: Typerapp.SVGProps<SVGFEFloodElement>;
            feFuncA: Typerapp.SVGProps<SVGFEFuncAElement>;
            feFuncB: Typerapp.SVGProps<SVGFEFuncBElement>;
            feFuncG: Typerapp.SVGProps<SVGFEFuncGElement>;
            feFuncR: Typerapp.SVGProps<SVGFEFuncRElement>;
            feGaussianBlur: Typerapp.SVGProps<SVGFEGaussianBlurElement>;
            feImage: Typerapp.SVGProps<SVGFEImageElement>;
            feMerge: Typerapp.SVGProps<SVGFEMergeElement>;
            feMergeNode: Typerapp.SVGProps<SVGFEMergeNodeElement>;
            feMorphology: Typerapp.SVGProps<SVGFEMorphologyElement>;
            feOffset: Typerapp.SVGProps<SVGFEOffsetElement>;
            fePointLight: Typerapp.SVGProps<SVGFEPointLightElement>;
            feSpecularLighting: Typerapp.SVGProps<SVGFESpecularLightingElement>;
            feSpotLight: Typerapp.SVGProps<SVGFESpotLightElement>;
            feTile: Typerapp.SVGProps<SVGFETileElement>;
            feTurbulence: Typerapp.SVGProps<SVGFETurbulenceElement>;
            filter: Typerapp.SVGProps<SVGFilterElement>;
            foreignObject: Typerapp.SVGProps<SVGForeignObjectElement>;
            g: Typerapp.SVGProps<SVGGElement>;
            image: Typerapp.SVGProps<SVGImageElement>;
            line: Typerapp.SVGProps<SVGLineElement>;
            linearGradient: Typerapp.SVGProps<SVGLinearGradientElement>;
            marker: Typerapp.SVGProps<SVGMarkerElement>;
            mask: Typerapp.SVGProps<SVGMaskElement>;
            metadata: Typerapp.SVGProps<SVGMetadataElement>;
            path: Typerapp.SVGProps<SVGPathElement>;
            pattern: Typerapp.SVGProps<SVGPatternElement>;
            polygon: Typerapp.SVGProps<SVGPolygonElement>;
            polyline: Typerapp.SVGProps<SVGPolylineElement>;
            radialGradient: Typerapp.SVGProps<SVGRadialGradientElement>;
            rect: Typerapp.SVGProps<SVGRectElement>;
            stop: Typerapp.SVGProps<SVGStopElement>;
            switch: Typerapp.SVGProps<SVGSwitchElement>;
            symbol: Typerapp.SVGProps<SVGSymbolElement>;
            text: Typerapp.SVGProps<SVGTextElement>;
            textPath: Typerapp.SVGProps<SVGTextPathElement>;
            tspan: Typerapp.SVGProps<SVGTSpanElement>;
            use: Typerapp.SVGProps<SVGUseElement>;
            view: Typerapp.SVGProps<SVGViewElement>;
        }
    }
}