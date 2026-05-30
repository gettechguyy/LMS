"use server";

import { OnboardingRepository } from "@/lib/repositories";
import { requireSession } from "@/lib/auth/session";
import { handleError } from "@/lib/errors";
import type { ApiResponse } from "@/types";

export async function saveOnboardingStepAction(
  step: number,
  data: Record<string, unknown>
): Promise<ApiResponse> {
  try {
    const session = await requireSession();
    const repo = new OnboardingRepository();
    await repo.saveProgress(session.id, step, data);
    return { success: true };
  } catch (error) {
    const appError = handleError(error);
    return { success: false, error: appError.message };
  }
}

export async function completeOnboardingAction(): Promise<ApiResponse> {
  try {
    const session = await requireSession();
    const repo = new OnboardingRepository();
    await repo.complete(session.id);
    return { success: true, message: "Onboarding completed" };
  } catch (error) {
    const appError = handleError(error);
    return { success: false, error: appError.message };
  }
}

export async function getOnboardingProgressAction(): Promise<ApiResponse> {
  try {
    const session = await requireSession();
    const repo = new OnboardingRepository();
    const progress = await repo.getProgress(session.id);
    return { success: true, data: progress };
  } catch (error) {
    const appError = handleError(error);
    return { success: false, error: appError.message };
  }
}
