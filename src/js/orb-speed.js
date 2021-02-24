function setOrbSpeed() {
    // Set orb speed by setting animation duration
    // 2s for window width of 1200px looks good, so duration = 1s for every 600px = window width / 600
    // Calculate duration
    var duration = Math.max(window.innerWidth / 600, 1.8);

    // Also need to set orb image changing animation speed to match
    // There are five orbs, so duration must be five times longer than the duration I just calculated

    if(document.getElementsByTagName('style').length) {
		document.body.removeChild(document.getElementsByTagName('style')[0]);
	}
	var style = document.createElement('style');
	style.innerHTML = `#fixed-field .orb { animation-duration: ${duration}s} #fixed-field .orb .orb-image { animation-duration: ${duration * 5}s }`;
	document.body.appendChild(style);
}

setOrbSpeed();
window.addEventListener('resize', setOrbSpeed);