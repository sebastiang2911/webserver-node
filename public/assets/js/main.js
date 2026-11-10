const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".site-nav");

menuButton?.addEventListener("click", () => {
  const isOpen = navigation?.classList.toggle("open") ?? false;
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

navigation?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navigation.classList.remove("open");
    menuButton?.setAttribute("aria-expanded", "false");
  });
});

document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    const command = button.getAttribute("data-copy");
    if (!command) return;

    await navigator.clipboard.writeText(command);
    const originalLabel = button.textContent;
    button.textContent = "Copied";
    setTimeout(() => {
      button.textContent = originalLabel;
    }, 1400);
  });
});
