(() => {
  'use strict';

  document.documentElement.classList.replace('no-js', 'js');
  document.documentElement.classList.add('engineering-ready');

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  const setPressedState = (buttons, activeButton) => {
    buttons.forEach((button) => {
      const active = button === activeButton;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  };

  const powerStage = document.querySelector('[data-power-stage]');
  if (powerStage) {
    const explorer = powerStage.querySelector('[data-stage-explorer]');
    const buttons = Array.from(powerStage.querySelectorAll('[data-stage-topic]'));
    const detailLabel = powerStage.querySelector('[data-stage-detail-label]');
    const detailTitle = powerStage.querySelector('[data-stage-detail-title]');
    const detailCopy = powerStage.querySelector('[data-stage-detail-copy]');
    const canvas = powerStage.querySelector('.stage-canvas');
    const topics = {
      load: {
        label: 'Scope 01 / Load assessment',
        title: 'Start with the connected load.',
        copy: 'Running load, motor starting current, duty cycle, sequencing and future expansion shape the recommendation.'
      },
      amf: {
        label: 'Scope 02 / AMF integration',
        title: 'Plan the complete changeover sequence.',
        copy: 'Mains sensing, the DG start interface, transfer logic, essential loads and operator handover must work as one approved system.'
      },
      service: {
        label: 'Scope 03 / Lifecycle support',
        title: 'Keep readiness visible after commissioning.',
        copy: 'Preventive inspections, battery and fluid checks, filters, control verification and operating records support dependable readiness.'
      }
    };

    buttons.forEach((button) => {
      button.disabled = false;
      button.addEventListener('click', () => {
        const topic = topics[button.dataset.stageTopic];
        if (!topic) return;
        setPressedState(buttons, button);
        detailLabel.textContent = topic.label;
        detailTitle.textContent = topic.title;
        detailCopy.textContent = topic.copy;
      });
    });

    let stageFrame = 0;

    const resetStageMotion = () => {
      if (stageFrame) {
        window.cancelAnimationFrame(stageFrame);
        stageFrame = 0;
      }
      powerStage.style.removeProperty('--stage-rotate-x');
      powerStage.style.removeProperty('--stage-rotate-y');
      powerStage.style.removeProperty('--stage-shift-x');
      powerStage.style.removeProperty('--stage-shift-y');
    };

    if (explorer) {
      explorer.addEventListener('toggle', () => {
        powerStage.classList.toggle('is-exploring', explorer.open);
        if (!explorer.open) resetStageMotion();
      });
    }

    if (canvas && explorer && finePointer && !reducedMotion) {
      let pointerX = 0;
      let pointerY = 0;

      canvas.addEventListener('pointermove', (event) => {
        if (!explorer.open) return;
        const rect = canvas.getBoundingClientRect();
        pointerX = (event.clientX - rect.left) / rect.width - 0.5;
        pointerY = (event.clientY - rect.top) / rect.height - 0.5;
        if (stageFrame) return;
        stageFrame = window.requestAnimationFrame(() => {
          powerStage.style.setProperty('--stage-rotate-x', `${pointerY * -3}deg`);
          powerStage.style.setProperty('--stage-rotate-y', `${pointerX * 4}deg`);
          powerStage.style.setProperty('--stage-shift-x', `${pointerX * 6}px`);
          powerStage.style.setProperty('--stage-shift-y', `${pointerY * 4}px`);
          stageFrame = 0;
        });
      }, { passive: true });
      canvas.addEventListener('pointerleave', resetStageMotion);
    }
  }

  const amfExperience = document.querySelector('[data-amf-experience]');
  if (amfExperience) {
    const buttons = Array.from(amfExperience.querySelectorAll('[data-amf-state]'));
    const visual = amfExperience.querySelector('.amf-visual');
    const status = amfExperience.querySelector('[data-amf-status]');
    const utilityState = amfExperience.querySelector('[data-amf-utility-state]');
    const panelState = amfExperience.querySelector('[data-amf-panel-state]');
    const dgState = amfExperience.querySelector('[data-amf-dg-state]');
    const loadState = amfExperience.querySelector('[data-amf-load-state]');
    const states = {
      monitor: {
        status: 'Utility available · DG standby', utility: 'Available', panel: 'Monitoring', dg: 'Standby', load: 'Utility supplied'
      },
      start: {
        status: 'Mains failure detected · start command issued', utility: 'Unavailable', panel: 'Start sequence', dg: 'Starting', load: 'Transfer pending'
      },
      transfer: {
        status: 'DG output accepted · supported load transferred', utility: 'Unavailable', panel: 'DG selected', dg: 'Supplying', load: 'DG supplied'
      },
      restore: {
        status: 'Utility stable · load retransferred · DG cool-down', utility: 'Restored', panel: 'Utility selected', dg: 'Cool-down', load: 'Utility supplied'
      }
    };

    buttons.forEach((button) => {
      button.disabled = false;
      button.addEventListener('click', () => {
        const key = button.dataset.amfState;
        const state = states[key];
        if (!state) return;
        amfExperience.dataset.state = key;
        setPressedState(buttons, button);
        status.textContent = state.status;
        utilityState.textContent = state.utility;
        panelState.textContent = state.panel;
        dgState.textContent = state.dg;
        loadState.textContent = state.load;
        visual.setAttribute('aria-label', `Representative AMF sequence. Utility and generator power connect to the transfer panel, while the AMF controller sends a separate start command to the DG. Current state: ${state.status}.`);
      });
    });
  }

  const installationExperience = document.querySelector('[data-installation-experience]');
  if (installationExperience) {
    const buttons = Array.from(installationExperience.querySelectorAll('[data-site-point]'));
    const detailCode = installationExperience.querySelector('[data-site-detail-code]');
    const detailTitle = installationExperience.querySelector('[data-site-detail-title]');
    const detailCopy = installationExperience.querySelector('[data-site-detail-copy]');
    const points = {
      access: {
        code: 'Site point 01', title: 'Equipment access', copy: 'Check the delivery vehicle approach, unloading area, door sizes and movement path to the final position.'
      },
      clearance: {
        code: 'Site point 02', title: 'Space and clearances', copy: 'Allow room for airflow, routine inspection, door opening and future maintenance activity.'
      },
      foundation: {
        code: 'Site point 03', title: 'Foundation readiness', copy: 'Coordinate dimensions, level, structural readiness and the approved anti-vibration requirement before positioning.'
      },
      airflow: {
        code: 'Site point 04', title: 'Ventilation path', copy: 'Plan cool-air intake and hot-air discharge so heated air is not drawn back into the generator space.'
      },
      exhaust: {
        code: 'Site point 05', title: 'Exhaust route', copy: 'Review routing, support, clearances and the final discharge location as part of the building plan.'
      },
      electrical: {
        code: 'Site point 06', title: 'Cable route and earthing', copy: 'Coordinate panel positions, cable length, trench or tray route, earthing and protection interfaces.'
      },
      fuel: {
        code: 'Site point 07', title: 'Fuel access', copy: 'Define the approved storage, piping, filling access and housekeeping responsibilities for the project.'
      }
    };

    buttons.forEach((button) => {
      button.disabled = false;
      button.addEventListener('click', () => {
        const key = button.dataset.sitePoint;
        const point = points[key];
        if (!point) return;
        installationExperience.dataset.point = key;
        setPressedState(buttons, button);
        detailCode.textContent = point.code;
        detailTitle.textContent = point.title;
        detailCopy.textContent = point.copy;
      });
    });
  }
})();
