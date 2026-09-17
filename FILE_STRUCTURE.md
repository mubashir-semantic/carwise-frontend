# CarWise Project File Structure

```text
CarWise_Project/
├── carwise-frontend/
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   │   ├── globals.css
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── (auth)/
│   │   │   │   ├── change-password/page.tsx
│   │   │   │   ├── forgot-password/page.tsx
│   │   │   │   ├── login/page.tsx
│   │   │   │   ├── otp/page.tsx
│   │   │   │   ├── password-success/page.tsx
│   │   │   │   ├── reset-password/page.tsx
│   │   │   │   └── signup/page.tsx
│   │   │   └── dashboard/
│   │   │       ├── layout.tsx
│   │   │       ├── page.tsx
│   │   │       ├── _components/
│   │   │       │   ├── CarStatus.tsx
│   │   │       │   ├── DashboardHeader.tsx
│   │   │       │   ├── HeroBanner.tsx
│   │   │       │   ├── RightSidebar.tsx
│   │   │       │   ├── Sidebar.tsx
│   │   │       │   └── StatsCards.tsx
│   │   │       ├── expense/
│   │   │       │   ├── page.tsx
│   │   │       │   ├── _components/
│   │   │       │   │   ├── ExpenseHistoryList.tsx
│   │   │       │   │   └── ExpenseTips.tsx
│   │   │       │   └── [id]/page.tsx
│   │   │       └── service-history/page.tsx
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── AuthLink.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Container.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── OtpInput.tsx
│   │   │   ├── SocialButton.tsx
│   │   │   └── ui/
│   │   │       ├── AddVehicleModal.tsx
│   │   │       ├── FloatingInput.tsx
│   │   │       └── Modal.tsx
│   │   ├── constants/
│   │   │   ├── colors.ts
│   │   │   └── dummyData.ts
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── services/api.ts
│   │   ├── types/
│   │   └── utilities/validations.ts
│   ├── eslint.config.mjs
│   ├── next-env.d.ts
│   ├── next.config.ts
│   ├── package.json
│   ├── package-lock.json
│   ├── postcss.config.mjs
│   └── tsconfig.json
│
└── carwise-backend/
	├── src/
	│   ├── app.controller.spec.ts
	│   ├── app.controller.ts
	│   ├── app.module.ts
	│   ├── app.service.ts
	│   ├── main.ts
	│   ├── auth/
	│   │   ├── auth.controller.spec.ts
	│   │   ├── auth.controller.ts
	│   │   ├── auth.module.ts
	│   │   ├── auth.service.spec.ts
	│   │   ├── auth.service.ts
	│   │   ├── email.service.ts
	│   │   ├── jwt.strategy.ts
	│   │   └── dto/
	│   │       ├── login.dto.ts
	│   │       └── signup.dto.ts
	│   ├── common/
	│   │   ├── middleware/http-exception.filter.ts
	│   │   └── utils/
	│   ├── config/
	│   ├── health/
	│   │   ├── health.controller.spec.ts
	│   │   ├── health.controller.ts
	│   │   ├── health.module.ts
	│   │   ├── health.service.spec.ts
	│   │   └── health.service.ts
	│   └── users/
	│       ├── users.controller.ts
	│       ├── users.module.ts
	│       ├── users.service.spec.ts
	│       ├── users.service.ts
	│       ├── dto/update-profile.dto.ts
	│       └── schemas/user.schema.ts
	├── test/
	│   ├── app.e2e-spec.ts
	│   └── jest-e2e.json
	├── CONTRIBUTING.md
	├── jest.config.ts
	├── nest-cli.json
	├── oxlint.json
	├── package.json
	├── README.md
	├── tsconfig.build.json
	└── tsconfig.json
```
