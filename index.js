describe('Тестирование модуля Вакансии на Profteam', () => {

    const baseUrl = 'https://dev.profteam.su';

    // Тест 1: Создание новой вакансии работодателем
    it('Создание новой вакансии работодателем', () => {
        cy.visit(`${baseUrl}/login`);
        // Авторизация (используйте тестовые данные из fixture или окружения)
        cy.get('input[name="email"]').type('employer@example.com');
        cy.get('input[name="password"]').type('password123');
        cy.get('button[type="submit"]').click();
        cy.get('input[name="login"]').type('testerEmployer');
        cy.get('input[name="password"]').type('Password1');
        cy.get('button[type="submit"]').click();
        cy.visit(`${baseUrl}/vacancies/create`);
        cy.get('input[name="title"]').type('Frontend Разработчик');
        cy.visit(`${baseUrl}/vacancies/create`);

        cy.get('input[name="title"]').type('Frontend Разработчик');
        cy.get('textarea[name="description"]').type('Опыт работы с React и Cypress');
        cy.get('input[name="salary"]').type('100000');

        cy.get('select[name="category"]').select('Информационные технологии');

        cy.get('button#save-vacancy').click();
        cy.should('contain', 'Вакансия успешно создана');
    });

    it('Негативный тест: Ошибка авторизации с неверным паролем', () => {
        cy.visit(`${baseUrl}/login`);
        cy.get('input[name="login"]').type('testerEmployer');
        cy.get('input[name="password"]').type('WrongPassword123');
        cy.get('button[type="submit"]').click();

        cy.contains('Неверный логин или пароль').should('be.visible');
    });

    // Тест 2: Просмотр страницы с вакансиями, поиск и фильтрация
    it('Поиск и фильтрация вакансий', () => {
        cy.visit(`${baseUrl}/vacancies`);
        cy.get('input[placeholder*="Поиск"]').type('Frontend{enter}');
        cy.wait(2000);
        cy.get('.vacancy-card').should('have.length.at.least', 1);
        cy.get('.vacancy-card').first().should('contain', 'Frontend');
        cy.get('#filter-employment-type').click();
        cy.get('label').contains('Полная занятость').click();
        cy.get('#apply-filters').click();

        cy.get('.vacancy-card').should('be.visible');
    });

    // Тест 3: Отклик на вакансию студентом
    it('Отклик на вакансию студентом', () => {
        cy.visit(`${baseUrl}/login`);
        cy.get('input[name="email"]').type('student@example.com');
        cy.get('input[name="password"]').type('password123');
        cy.get('button[type="submit"]').click();

        cy.visit(`${baseUrl}/vacancies`);
        cy.get('.vacancy-card').first().find('a').click();
        cy.get('button').contains('Откликнуться').click();
        cy.get('.notification-success').should('be.visible');
        cy.contains('Вы успешно откликнулись').should('exist');
    });

    // Тест 4: Подтверждение отклика и взаимодействие в рабочем пространстве
    it('Подтверждение отклика и работа со статусами', () => {
        cy.visit(`${baseUrl}/login`);
        cy.get('input[name="email"]').type('employer@example.com');
        cy.get('input[name="password"]').type('password123');
        cy.get('button[type="submit"]').click();
        cy.visit(`${baseUrl}/workspace/responses`);
        cy.get('.response-item').first().within(() => {
            cy.get('button').contains('Подтвердить').click();
        });
        cy.visit(`${baseUrl}/workspace/active`);
        cy.contains('Frontend Разработчик').click();

        cy.get('#change-status-select').select('In Progress');
        cy.get('#save-status').click();
        cy.get('.status-badge').should('contain', 'В работе');
    });
});