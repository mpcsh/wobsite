// child page:
window.addEventListener("load", () => {
	const msg = {
		type: "iframeResize",
		width: document.body.scrollWidth,
		height: document.body.scrollHeight,
	};

	// window.top is the outermost parent in an iframe chain: https://developer.mozilla.org/en-US/docs/Web/API/Window/top
	// "*" indicates no preference for target origin: https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage#targetorigin
	window.top.postMessage(msg, "*");
});

// parent page:
window.addEventListener("message", ({ data: { type, width, height } }) => {
	if (type === "iframeResize") {
		const iframe = document.getElementById("embed");
		if (iframe) {
			iframe.style.width = width + "px";
			iframe.style.height = height + "px";
		}
	}
});
