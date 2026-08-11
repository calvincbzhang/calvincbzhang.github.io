$(document).ready(function () {
  // Generate the table of contents from the rendered article headings.
  const contents = document.querySelector("d-contents");
  if (contents) {
    const nav = contents.querySelector("nav");
    const headings = Array.from(document.querySelectorAll("d-article h2, d-article h3")).filter(
      (heading) => !heading.closest("d-contents") && !heading.hasAttribute("no-toc"),
    );

    if (headings.length === 0) {
      contents.remove();
    } else {
      let subsectionList = null;

      headings.forEach(function (heading, index) {
        if (!heading.id) {
          const slug =
            heading.textContent
              .trim()
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-|-$/g, "") || `section-${index + 1}`;
          let uniqueSlug = slug;
          let suffix = 2;
          while (document.getElementById(uniqueSlug)) {
            uniqueSlug = `${slug}-${suffix}`;
            suffix += 1;
          }
          heading.id = uniqueSlug;
        }

        const link = document.createElement("a");
        link.href = `#${heading.id}`;
        link.textContent = heading.textContent.trim();

        if (heading.tagName === "H3") {
          if (!subsectionList) {
            subsectionList = document.createElement("ul");
            nav.appendChild(subsectionList);
          }
          const listItem = document.createElement("li");
          listItem.appendChild(link);
          subsectionList.appendChild(listItem);
        } else {
          subsectionList = null;
          const section = document.createElement("div");
          section.appendChild(link);
          nav.appendChild(section);
        }
      });

      contents.removeAttribute("hidden");
    }
  }

  // Override styles of the footnotes.
  document.querySelectorAll("d-footnote").forEach(function (footnote) {
    footnote.shadowRoot.querySelector("sup > span").setAttribute("style", "color: var(--global-theme-color);");
    footnote.shadowRoot
      .querySelector("d-hover-box")
      .shadowRoot.querySelector("style")
      .sheet.insertRule(".panel {background-color: var(--global-bg-color) !important;}");
    footnote.shadowRoot
      .querySelector("d-hover-box")
      .shadowRoot.querySelector("style")
      .sheet.insertRule(".panel {border-color: var(--global-divider-color) !important;}");
  });
  // Override styles of the citations.
  document.querySelectorAll("d-cite").forEach(function (cite) {
    cite.shadowRoot.querySelector("div > span").setAttribute("style", "color: var(--global-theme-color);");
    cite.shadowRoot.querySelector("style").sheet.insertRule("ul li a {color: var(--global-text-color) !important; text-decoration: none;}");
    cite.shadowRoot.querySelector("style").sheet.insertRule("ul li a:hover {color: var(--global-theme-color) !important;}");
    cite.shadowRoot
      .querySelector("d-hover-box")
      .shadowRoot.querySelector("style")
      .sheet.insertRule(".panel {background-color: var(--global-bg-color) !important;}");
    cite.shadowRoot
      .querySelector("d-hover-box")
      .shadowRoot.querySelector("style")
      .sheet.insertRule(".panel {border-color: var(--global-divider-color) !important;}");
  });
});
