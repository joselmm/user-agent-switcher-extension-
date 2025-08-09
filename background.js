function updateRules(userAgent, enabled) {
  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [1],
    addRules: enabled && userAgent
      ? [{
          id: 1,
          priority: 1,
          action: {
            type: "modifyHeaders",
            requestHeaders: [
              {
                header: "User-Agent",
                operation: "set",
                value: userAgent
              }
            ]
          },
          condition: {
            urlFilter: "|http*|",
            resourceTypes: ["main_frame", "sub_frame", "xmlhttprequest"]
          }
        }]
      : []
  });
}

// Inicializar reglas al cargar
chrome.storage.local.get(["userAgent", "uaEnabled"], ({ userAgent, uaEnabled }) => {
  updateRules(userAgent, uaEnabled ?? true);
});

// Reactivar cuando se cambie el estado
chrome.storage.onChanged.addListener((changes) => {
  chrome.storage.local.get(["userAgent", "uaEnabled"], ({ userAgent, uaEnabled }) => {
    updateRules(userAgent, uaEnabled ?? true);
  });
});
