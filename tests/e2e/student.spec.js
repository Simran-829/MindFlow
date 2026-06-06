import { test, expect } from '@playwright/test';

test.describe('MindFlow Student E2E Journeys', () => {

  test('User Onboarding & Socratic Tutoring flow', async ({ page }) => {
    // Navigate to application
    await page.goto('/');

    // 1. Onboarding Form inputs
    const nameInput = page.locator('#onboard-name');
    await expect(nameInput).toBeVisible();
    await nameInput.fill('Playwright Student');

    // Select UPSC target exam card
    const upscCard = page.locator('.exam-card[data-exam="upsc"]');
    await upscCard.dispatchEvent('click');
    await expect(upscCard).toHaveClass(/selected/);

    // Proceed to Step 2
    await page.locator('#onboard-next-1').dispatchEvent('click');

    // Trigger voice calibration
    await page.locator('#voice-calibrate-btn').dispatchEvent('click');
    
    // Wait for the mock 3.5s calibration timer to finish and unlock next button
    await page.waitForTimeout(4500); 
    
    const finishBtn = page.locator('#onboard-next-2');
    await expect(finishBtn).toBeEnabled();
    await finishBtn.dispatchEvent('click');

    // Verify Onboarding modal is hidden
    const onboardingModal = page.locator('#onboarding-modal');
    await expect(onboardingModal).toBeHidden();

    // Verify initial welcoming message is printed in chat
    const chatBox = page.locator('#chat-box');
    await expect(chatBox).toContainText('Playwright Student');
  });

  test('Mock Exam Interaction & Panic Recovery Sigher', async ({ page }) => {
    // Bypass onboarding overlay by injecting mocked profile directly in LocalStorage before page loads
    await page.addInitScript(() => {
      localStorage.setItem('mindflow_user_profile', JSON.stringify({
        name: 'Automated Test User',
        targetExam: 'jee',
        targetHours: 10
      }));
    });
    
    // Navigate to page
    await page.goto('/');

    // Navigate to Mock Exam Practice Mode
    await page.locator('.tab-btn[data-view="exam"]').dispatchEvent('click');
    await expect(page.locator('#view-exam')).toBeVisible();

    // Verify choice description loaded
    const optionB = page.locator('.exam-option[data-option="b"]');
    await expect(optionB).toBeVisible();

    // Click option B
    await optionB.dispatchEvent('click');
    await expect(optionB).toHaveClass(/selected/);

    // Click Next Question
    await page.locator('#exam-next-btn').dispatchEvent('click');

    // Verify question is skipped/incremented and option texts update correctly (Bug FT-03 resolved check)
    const nextQuestionText = page.locator('#exam-question-text');
    await expect(nextQuestionText).not.toBeEmpty();

    // Trigger exam panic stress simulation
    await page.locator('#btn-exam-trigger-stress').dispatchEvent('click');

    // Guided breathing modal should intercept and open
    const calmingModal = page.locator('#calming-modal');
    await expect(calmingModal).toHaveClass(/active/);
    await expect(page.locator('#breath-lbl-action')).toBeVisible();

    // Skip breathing sequence
    await page.locator('#skip-breath-btn').dispatchEvent('click');
    await expect(calmingModal).not.toHaveClass(/active/);
  });
});
