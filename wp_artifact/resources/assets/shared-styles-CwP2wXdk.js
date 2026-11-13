import{b as l,A as i,_ as a,n as r,e as c,a as p,i as h}from"./animation-BsRNVet6.js";import"./md-focus-ring-DtP2NuRg.js";import"./ripple-Bgvr9i2M.js";import{o as b}from"./query-assigned-elements-QVN6gf3Z.js";import{m as u}from"./delegate-DDQ3oHg2.js";import{s as f}from"./form-submitter-C0TUL0Ca.js";import{i as g,m as v}from"./element-internals-C8NPV_ge.js";function m(o){const t=new MouseEvent("click",{bubbles:!0});return o.dispatchEvent(t),t}function _(o){return o.currentTarget!==o.target||o.composedPath()[0]!==o.target||o.target.disabled?!1:!x(o)}function x(o){const t=d;return t&&(o.preventDefault(),o.stopImmediatePropagation()),y(),t}let d=!1;async function y(){d=!0,await null,d=!1}const w=u(v(p));class e extends w{get name(){return this.getAttribute("name")??""}set name(t){this.setAttribute("name",t)}get form(){return this[g].form}constructor(){super(),this.disabled=!1,this.softDisabled=!1,this.href="",this.download="",this.target="",this.trailingIcon=!1,this.hasIcon=!1,this.type="submit",this.value="",this.addEventListener("click",this.handleClick.bind(this))}focus(){this.buttonElement?.focus()}blur(){this.buttonElement?.blur()}render(){const t=this.disabled||this.softDisabled,s=this.href?this.renderLink():this.renderButton(),n=this.href?"link":"button";return l`
      ${this.renderElevationOrOutline?.()}
      <div class="background"></div>
      <md-focus-ring part="focus-ring" for=${n}></md-focus-ring>
      <md-ripple
        part="ripple"
        for=${n}
        ?disabled="${t}"></md-ripple>
      ${s}
    `}renderButton(){const{ariaLabel:t,ariaHasPopup:s,ariaExpanded:n}=this;return l`<button
      id="button"
      class="button"
      ?disabled=${this.disabled}
      aria-disabled=${this.softDisabled||i}
      aria-label="${t||i}"
      aria-haspopup="${s||i}"
      aria-expanded="${n||i}">
      ${this.renderContent()}
    </button>`}renderLink(){const{ariaLabel:t,ariaHasPopup:s,ariaExpanded:n}=this;return l`<a
      id="link"
      class="button"
      aria-label="${t||i}"
      aria-haspopup="${s||i}"
      aria-expanded="${n||i}"
      aria-disabled=${this.disabled||this.softDisabled||i}
      tabindex="${this.disabled&&!this.softDisabled?-1:i}"
      href=${this.href}
      download=${this.download||i}
      target=${this.target||i}
      >${this.renderContent()}
    </a>`}renderContent(){const t=l`<slot
      name="icon"
      @slotchange="${this.handleSlotChange}"></slot>`;return l`
      <span class="touch"></span>
      ${this.trailingIcon?i:t}
      <span class="label"><slot></slot></span>
      ${this.trailingIcon?t:i}
    `}handleClick(t){if(this.softDisabled||this.disabled&&this.href){t.stopImmediatePropagation(),t.preventDefault();return}!_(t)||!this.buttonElement||(this.focus(),m(this.buttonElement))}handleSlotChange(){this.hasIcon=this.assignedIcons.length>0}}f(e);e.formAssociated=!0;e.shadowRootOptions={mode:"open",delegatesFocus:!0};a([r({type:Boolean,reflect:!0})],e.prototype,"disabled",void 0);a([r({type:Boolean,attribute:"soft-disabled",reflect:!0})],e.prototype,"softDisabled",void 0);a([r()],e.prototype,"href",void 0);a([r()],e.prototype,"download",void 0);a([r()],e.prototype,"target",void 0);a([r({type:Boolean,attribute:"trailing-icon",reflect:!0})],e.prototype,"trailingIcon",void 0);a([r({type:Boolean,attribute:"has-icon",reflect:!0})],e.prototype,"hasIcon",void 0);a([r()],e.prototype,"type",void 0);a([r({reflect:!0})],e.prototype,"value",void 0);a([c(".button")],e.prototype,"buttonElement",void 0);a([b({slot:"icon",flatten:!0})],e.prototype,"assignedIcons",void 0);const B=h`:host{border-start-start-radius:var(--_container-shape-start-start);border-start-end-radius:var(--_container-shape-start-end);border-end-start-radius:var(--_container-shape-end-start);border-end-end-radius:var(--_container-shape-end-end);box-sizing:border-box;cursor:pointer;display:inline-flex;gap:8px;min-height:var(--_container-height);outline:none;padding-block:calc((var(--_container-height) - max(var(--_label-text-line-height),var(--_icon-size)))/2);padding-inline-start:var(--_leading-space);padding-inline-end:var(--_trailing-space);place-content:center;place-items:center;position:relative;font-family:var(--_label-text-font);font-size:var(--_label-text-size);line-height:var(--_label-text-line-height);font-weight:var(--_label-text-weight);text-overflow:ellipsis;text-wrap:nowrap;user-select:none;-webkit-tap-highlight-color:rgba(0,0,0,0);vertical-align:top;--md-ripple-hover-color: var(--_hover-state-layer-color);--md-ripple-pressed-color: var(--_pressed-state-layer-color);--md-ripple-hover-opacity: var(--_hover-state-layer-opacity);--md-ripple-pressed-opacity: var(--_pressed-state-layer-opacity)}md-focus-ring{--md-focus-ring-shape-start-start: var(--_container-shape-start-start);--md-focus-ring-shape-start-end: var(--_container-shape-start-end);--md-focus-ring-shape-end-end: var(--_container-shape-end-end);--md-focus-ring-shape-end-start: var(--_container-shape-end-start)}:host(:is([disabled],[soft-disabled])){cursor:default;pointer-events:none}.button{border-radius:inherit;cursor:inherit;display:inline-flex;align-items:center;justify-content:center;border:none;outline:none;-webkit-appearance:none;vertical-align:middle;background:rgba(0,0,0,0);text-decoration:none;min-width:calc(64px - var(--_leading-space) - var(--_trailing-space));width:100%;z-index:0;height:100%;font:inherit;color:var(--_label-text-color);padding:0;gap:inherit;text-transform:inherit}.button::-moz-focus-inner{padding:0;border:0}:host(:hover) .button{color:var(--_hover-label-text-color)}:host(:focus-within) .button{color:var(--_focus-label-text-color)}:host(:active) .button{color:var(--_pressed-label-text-color)}.background{background:var(--_container-color);border-radius:inherit;inset:0;position:absolute}.label{overflow:hidden}:is(.button,.label,.label slot),.label ::slotted(*){text-overflow:inherit}:host(:is([disabled],[soft-disabled])) .label{color:var(--_disabled-label-text-color);opacity:var(--_disabled-label-text-opacity)}:host(:is([disabled],[soft-disabled])) .background{background:var(--_disabled-container-color);opacity:var(--_disabled-container-opacity)}@media(forced-colors: active){.background{border:1px solid CanvasText}:host(:is([disabled],[soft-disabled])){--_disabled-icon-color: GrayText;--_disabled-icon-opacity: 1;--_disabled-container-opacity: 1;--_disabled-label-text-color: GrayText;--_disabled-label-text-opacity: 1}}:host([has-icon]:not([trailing-icon])){padding-inline-start:var(--_with-leading-icon-leading-space);padding-inline-end:var(--_with-leading-icon-trailing-space)}:host([has-icon][trailing-icon]){padding-inline-start:var(--_with-trailing-icon-leading-space);padding-inline-end:var(--_with-trailing-icon-trailing-space)}::slotted([slot=icon]){display:inline-flex;position:relative;writing-mode:horizontal-tb;fill:currentColor;flex-shrink:0;color:var(--_icon-color);font-size:var(--_icon-size);inline-size:var(--_icon-size);block-size:var(--_icon-size)}:host(:hover) ::slotted([slot=icon]){color:var(--_hover-icon-color)}:host(:focus-within) ::slotted([slot=icon]){color:var(--_focus-icon-color)}:host(:active) ::slotted([slot=icon]){color:var(--_pressed-icon-color)}:host(:is([disabled],[soft-disabled])) ::slotted([slot=icon]){color:var(--_disabled-icon-color);opacity:var(--_disabled-icon-opacity)}.touch{position:absolute;top:50%;height:48px;left:0;right:0;transform:translateY(-50%)}:host([touch-target=wrapper]){margin:max(0px,(48px - var(--_container-height))/2) 0}:host([touch-target=none]) .touch{display:none}
`;export{e as B,B as s};
