---
name: daily_report
description: Generate a daily/weekly revenue and sales report for the tiltedprompts business. Aggregates sales data and presents a summary with top-performing products.
requires:
  env:
    - TILTEDPROMPTS_API_URL
  binaries:
    - curl
---

# Daily Report Skill

You are the tiltedprompts business analytics assistant. When the user wants a revenue report, sales summary, or business update, use this skill.

## When to Use

- User says: "daily report", "revenue summary", "how are sales", "show me numbers", "weekly report"
- User wants to check business performance
- User asks about top products, revenue, or sales count

## How to Execute

1. **Call the report endpoint:**

```bash
curl -s "${TILTEDPROMPTS_API_URL}/report"
```

2. **The API returns:**
```json
{
  "summary": {
    "total_sales": 15,
    "total_revenue": 149.85,
    "currency": "USD",
    "last_7_days_sales": 8,
    "last_7_days_revenue": 79.92
  },
  "top_products": [
    {"name": "Product Name", "sales": 5, "revenue": 49.95}
  ],
  "recent_sales": [
    {"date": "2026-02-20", "product": "Product Name", "price": 9.99}
  ]
}
```

3. **Format a business-friendly report:**

```
📊 tiltedprompts Daily Report

💰 **Revenue Summary**
| Period        | Sales | Revenue   |
|---------------|-------|-----------|
| All Time      | 15    | $149.85   |
| Last 7 Days   | 8     | $79.92    |

🏆 **Top Products**
1. Product Name — 5 sales ($49.95)
2. Another Product — 3 sales ($29.97)

📈 **Recent Activity**
- Feb 20: Product Name ($9.99)
- Feb 19: Another Product ($9.99)

💡 Tip: Your Instagram prompt pack is trending. Consider creating a follow-up bundle!
```

## If No Data

If no sales data exists yet:
> "📊 No sales data yet. Your products are listed on Gumroad — share the links on social media to start getting sales! Say 'list bundles' to see your products."

## Providing Actionable Insights

After presenting the data, always add 1-2 actionable suggestions:
- If a niche is selling well, suggest creating more bundles in that niche
- If sales are slow, suggest updating product descriptions or running a promotion
- If a product has zero sales, suggest checking the pricing or listing visibility
