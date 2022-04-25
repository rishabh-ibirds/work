import { LightningElement, api } from 'lwc';

export default class RoutePath extends LightningElement {

    @api route = [];

    renderedCallback(){
        let body = this.template.querySelector('.route');
        body.innerHTML = `<div class="slds-progress slds-progress_vertical">
                            <ol class="slds-progress__list">`;
        this.route.forEach(element => {
            body.innerHTML += `<li class="slds-progress__item slds-is-active">
                                    <div class="slds-progress__marker"></div>
                                    <div class="slds-progress__item_content slds-grid slds-grid_align-spread">
                                    </div>
                                    <div class="slds-text-heading_medium slds-p-left_medium">${element.Station} (${element.Distance}kms away)</div>
                                </li>`;

                                if(element != this.route[this.route.length-1]){
                                    body.innerHTML += `<svg height="100" width="400" >
                                                        <line x1="8" y1="0" x2="8" y2="400" style="stroke:rgb(8, 112, 177);stroke-width:5" />
                                                       </svg>`;
                                }
                                
                                
        });
        body.innerHTML += `</ol>
                            <div aria-valuemin="0" aria-valuemax="100" aria-valuenow="100" role="progressbar">
                            <span class="slds-assistive-text">Progress: 25%</span>
                            </div>
                        </div>`;
    }
}

/* <div class="slds-progress slds-progress_vertical">
  <ol class="slds-progress__list">
    <li class="slds-progress__item slds-is-completed">
      <span class="slds-icon_container slds-icon-utility-success slds-progress__marker slds-progress__marker_icon" title="Complete">
        <svg class="slds-icon slds-icon_xx-small" aria-hidden="true">
          <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#success"></use>
        </svg>
        <span class="slds-assistive-text">Complete</span>
      </span>
      <div class="slds-progress__item_content slds-grid slds-grid_align-spread">Step 1</div>
    </li>
    <li class="slds-progress__item slds-is-active">
      <div class="slds-progress__marker">
        <span class="slds-assistive-text">Active</span>
      </div>
      <div class="slds-progress__item_content slds-grid slds-grid_align-spread">Step 2</div>
    </li>
    <li class="slds-progress__item">
      <div class="slds-progress__marker"></div>
      <div class="slds-progress__item_content slds-grid slds-grid_align-spread">Step 3</div>
    </li>
    <li class="slds-progress__item">
      <div class="slds-progress__marker"></div>
      <div class="slds-progress__item_content slds-grid slds-grid_align-spread">Step 4</div>
    </li>
    <li class="slds-progress__item">
      <div class="slds-progress__marker"></div>
      <div class="slds-progress__item_content slds-grid slds-grid_align-spread">Step 5</div>
    </li>
  </ol>
  <div aria-valuemin="0" aria-valuemax="100" aria-valuenow="25" role="progressbar">
    <span class="slds-assistive-text">Progress: 25%</span>
  </div>
</div> */