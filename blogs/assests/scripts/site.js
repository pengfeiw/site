(() => {
    const searchForm = document.getElementById("site-search");
    if (searchForm) {
        searchForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const input = document.getElementById("search-input");
            const query = input.value.trim();
            if (query) window.open(`https://www.bing.com/search?q=${encodeURIComponent(`${query} site:pengfeixc.com/blogs`)}`, "_blank", "noopener,noreferrer");
        });
    }

    const tocPanel = document.querySelector(".toc-panel");
    if (tocPanel) {
        const narrowScreen = window.matchMedia("(max-width: 1439px)");
        const updateToc = () => { tocPanel.open = !narrowScreen.matches; };
        updateToc();
        narrowScreen.addEventListener("change", updateToc);
    }

    document.querySelectorAll(".markdown-body pre").forEach((pre) => {
        const code = pre.querySelector("code");
        if (!code) return;
        const wrapper = document.createElement("div");
        wrapper.className = "code-block-wrapper";
        pre.parentNode.insertBefore(wrapper, pre);
        const toolbar = document.createElement("div");
        toolbar.className = "code-toolbar";
        const language = document.createElement("span");
        const languageClass = [...code.classList].find((name) => name.startsWith("language-"));
        language.textContent = languageClass ? languageClass.slice(9) : "代码";
        const copyButton = document.createElement("button");
        copyButton.type = "button";
        copyButton.className = "code-copy-btn";
        copyButton.textContent = "复制代码";
        copyButton.setAttribute("aria-label", `复制 ${language.textContent} 代码`);
        copyButton.setAttribute("aria-live", "polite");
        toolbar.append(language, copyButton);
        wrapper.append(toolbar, pre);
        copyButton.addEventListener("click", async () => {
            try {
                await navigator.clipboard.writeText(code.textContent);
                copyButton.textContent = "已复制 ✓";
            } catch (error) {
                const selection = window.getSelection();
                const range = document.createRange();
                range.selectNodeContents(code);
                selection.removeAllRanges();
                selection.addRange(range);
                copyButton.textContent = "已选中，请复制";
            }
            window.setTimeout(() => { copyButton.textContent = "复制代码"; }, 2000);
        });
    });

    // 将宽表格的滚动限制在表格内部，避免挤宽手机上的整篇文章。
    document.querySelectorAll(".markdown-body table").forEach((table) => {
        const wrapper = document.createElement("div");
        wrapper.className = "table-scroll";
        wrapper.tabIndex = 0;
        wrapper.setAttribute("role", "region");
        wrapper.setAttribute("aria-label", "表格，可横向滚动");
        table.parentNode.insertBefore(wrapper, table);
        wrapper.appendChild(table);
    });

    const lightbox = document.querySelector(".image-lightbox");
    const images = [...document.querySelectorAll(".markdown-body img:not(.emoji)")];
    if (!lightbox || !images.length) return;
    const preview = lightbox.querySelector(".lightbox-image");
    const counter = lightbox.querySelector(".lightbox-counter");
    const previous = lightbox.querySelector(".lightbox-prev");
    const next = lightbox.querySelector(".lightbox-next");
    let imageIndex = 0;
    let previousOverflow = "";

    function updateImage() {
        const source = images[imageIndex];
        preview.src = source.currentSrc || source.src;
        preview.alt = source.alt || "";
        counter.textContent = `${imageIndex + 1} / ${images.length}`;
        previous.hidden = images.length < 2;
        next.hidden = images.length < 2;
    }

    function openImage(index) {
        imageIndex = index;
        updateImage();
        previousOverflow = document.body.style.overflow;
        lightbox.showModal();
        document.body.style.overflow = "hidden";
    }

    images.forEach((image, index) => {
        image.classList.add("zoomable-image");
        image.tabIndex = 0;
        image.setAttribute("role", "button");
        image.setAttribute("aria-label", `查看大图：${image.alt || `图片 ${index + 1}`}`);
        image.addEventListener("click", (event) => {
            event.preventDefault();
            openImage(index);
        });
        image.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openImage(index);
            }
        });
    });
    lightbox.querySelector(".lightbox-close").addEventListener("click", () => lightbox.close());
    lightbox.addEventListener("click", (event) => {
        if (event.target === lightbox) lightbox.close();
    });
    lightbox.addEventListener("close", () => { document.body.style.overflow = previousOverflow; });
    function stepImage(step) {
        imageIndex = (imageIndex + step + images.length) % images.length;
        updateImage();
    }
    previous.addEventListener("click", () => stepImage(-1));
    next.addEventListener("click", () => stepImage(1));
    lightbox.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            stepImage(event.key === "ArrowLeft" ? -1 : 1);
        }
    });
})();
