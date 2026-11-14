import {
  EXERCISE_ANIMATION_REGISTRY,
  EXERCISE_ANIMATION_SOURCES,
  getExerciseAnimationSource,
  getExerciseAnimationMeta,
  getAnimationCoverageReport,
} from '../../src/animations/registry/exerciseAnimationRegistry';

describe('Phase 5.1 — 2D Vector Animation Engine & Kinematics Validation', () => {
  const movementArchetypes = [
    { pattern: 'push_up', slug: 'standard-push-up' },
    { pattern: 'pull_up', slug: 'standard-pull-up' },
    { pattern: 'squat', slug: 'bodyweight-squat' },
    { pattern: 'lunge', slug: 'reverse-lunges' },
    { pattern: 'plank', slug: 'forearm-plank' },
    { pattern: 'hollow_body', slug: 'hollow-body-hold' },
    { pattern: 'pike_pushup', slug: 'pike-push-up' },
    { pattern: 'prone_floor', slug: 'prone-cobra' },
    { pattern: 'dead_hang', slug: 'dead-hang' },
    { pattern: 'reverse_crunch', slug: 'reverse-crunch' },
    { pattern: 'handstand', slug: 'wall-handstand-hold' },
    { pattern: 'planche', slug: 'planche' },
    { pattern: 'front_lever', slug: 'front-lever' },
    { pattern: 'back_lever', slug: 'back-lever' },
    { pattern: 'l_sit', slug: 'l-sit-progression' },
    { pattern: 'muscle_up', slug: 'muscle-up' },
    { pattern: 'crow_pose', slug: 'crow-pose' },
    { pattern: 'pistol_squat', slug: 'pistol-squat-progression' },
  ];

  test('every movement archetype has valid 60fps Lottie vector asset with multiple layers', () => {
    movementArchetypes.forEach(({ slug, pattern }) => {
      const source = getExerciseAnimationSource(slug);
      expect(source).toBeDefined();
      expect(source.v).toBe('5.5.7');
      expect(source.fr).toBe(60);
      expect(source.op).toBe(120);
      expect(source.w).toBe(300);
      expect(source.h).toBe(300);
      expect(source.layers.length).toBeGreaterThanOrEqual(4);

      const meta = getExerciseAnimationMeta(slug);
      expect(meta.diagramPattern).toBe(pattern);
    });
  });

  test('each Lottie asset includes athlete head, torso, and grounded/apparatus support', () => {
    movementArchetypes.forEach(({ slug }) => {
      const source = getExerciseAnimationSource(slug);
      const layerNames = source.layers.map((l: any) => l.nm.toLowerCase());

      const hasHead = layerNames.some((nm: string) => nm.includes('head'));
      const hasTorso = layerNames.some(
        (nm: string) =>
          nm.includes('torso') ||
          nm.includes('hips') ||
          nm.includes('back') ||
          nm.includes('body') ||
          nm.includes('core') ||
          nm.includes('pelvi') ||
          nm.includes('knees') ||
          nm.includes('chest')
      );
      const hasSupport = layerNames.some(
        (nm: string) =>
          nm.includes('floor') ||
          nm.includes('bar') ||
          nm.includes('wall') ||
          nm.includes('base') ||
          nm.includes('feet') ||
          nm.includes('ground')
      );

      expect(hasHead).toBe(true);
      expect(hasTorso).toBe(true);
      expect(hasSupport).toBe(true);
    });
  });

  test('coverage report verifies 100% accurate animations across all published exercises and skills', () => {
    const report = getAnimationCoverageReport();
    expect(report.totalPublishedExercises).toBe(31);
    expect(report.accurateAnimatedExercises).toBe(31);
    expect(report.staticIllustrations).toBe(0);
    expect(report.missingAnimations).toBe(0);
    expect(report.animatedSkillDemonstrations).toBe(8);
    expect(report.coveragePercentage).toBe(100);
  });
});
