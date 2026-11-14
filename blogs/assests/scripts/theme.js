(() => {
    const THEME_KEY = "site-theme";
    const LIGHT_THEME = "notebook-light";
    const DARK_THEME = "notebook-dark";
    let currentTheme = LIGHT_THEME;

    // 兼容旧主题偏好；没有保存过偏好时，默认使用新的浅色主题。
    try {
        const savedTheme = localStorage.getItem(THEME_KEY);
        if (savedTheme === DARK_THEME || savedTheme === "opencode-dark") {
            currentTheme = DARK_THEME;
        }
    } catch (error) {
        // 隐私模式禁用存储时，仍然可以在当前页面切换主题。
    }

    function applyTheme(theme) {
        currentTheme = theme;
        document.documentElement.setAttribute("data-theme", theme);
        const button = document.getElementById("theme-toggle");
        if (button) {
            const isDark = theme === DARK_THEME;
            button.textContent = isDark ? "☾ 深色" : "☀ 浅色";
            button.setAttribute("aria-pressed", String(isDark));
            button.setAttribute("aria-label", isDark ? "切换到浅色主题" : "切换到深色主题");
        }
    }

    applyTheme(currentTheme);
    document.addEventListener("DOMContentLoaded", () => {
        applyTheme(currentTheme);
        const button = document.getElementById("theme-toggle");
        if (button) {
            button.addEventListener("click", () => {
                applyTheme(currentTheme === DARK_THEME ? LIGHT_THEME : DARK_THEME);
                try {
                    localStorage.setItem(THEME_KEY, currentTheme);
                } catch (error) {
                    // 存储不可用不影响当前页面的主题。
                }
            });
        }
    });
})();
