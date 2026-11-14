import {
  EXERCISE_ANIMATION_REGISTRY,
  EXERCISE_ANIMATION_SOURCES,
  getExerciseAnimationMeta,
  getExerciseAnimationSource,
  getAnimationCoverageReport,
  PUBLISHED_EXERCISE_SLUGS,
  TARGET_SKILL_KEYS,
} from '../../src/animations/registry/exerciseAnimationRegistry';

describe('Phase 5.1 — Animation Enhancement & Full Coverage Audit', () => {
  test('all 31 published exercises have complete animation metadata in the registry', () => {
    expect(PUBLISHED_EXERCISE_SLUGS.length).toBe(31);

    PUBLISHED_EXERCISE_SLUGS.forEach((slug) => {
      const meta = EXERCISE_ANIMATION_REGISTRY[slug];
      expect(meta).toBeDefined();
      expect(meta.slug).toBe(slug);
      expect(meta.name.length).toBeGreaterThan(0);
      expect(meta.movementType).toBeDefined();
      expect(meta.cameraAngle).toBeDefined();
      expect(meta.startingPosition.length).toBeGreaterThan(10);
      expect(meta.movementSequence.length).toBeGreaterThan(15);
      expect(meta.endingPosition.length).toBeGreaterThan(10);
      expect(meta.instructionalCues.length).toBeGreaterThanOrEqual(2);
      expect(meta.loopConfig.durationMs).toBeGreaterThan(0);
      expect(meta.diagramPattern).toBeDefined();
      // All 31 published exercises are upgraded to verified_lottie in Phase 5.1
      expect(meta.verificationStatus).toBe('verified_lottie');
    });
  });

  test('all 31 published exercises resolve to valid verified Lottie animation assets', () => {
    PUBLISHED_EXERCISE_SLUGS.forEach((slug) => {
      const source = getExerciseAnimationSource(slug);
      expect(source).toBeDefined();
      expect(typeof source).toBe('object');
      expect(source.v).toBeDefined(); // Lottie version
      expect(source.layers).toBeDefined();
      expect(source.layers.length).toBeGreaterThan(0);
    });
  });

  test('all 8 target skills have verified animations with clear beginner progression distinction', () => {
    expect(TARGET_SKILL_KEYS.length).toBe(8);

    const expectedSkills = [
      'handstand',
      'planche',
      'front-lever',
      'back-lever',
      'l-sit',
      'muscle-up',
      'human-flag',
      'pistol-squat',
    ];

    expectedSkills.forEach((skill) => {
      expect(TARGET_SKILL_KEYS).toContain(skill);
      const source = getExerciseAnimationSource(skill);
      expect(source).toBeDefined();
      expect(source.v).toBeDefined();
      expect(source.layers.length).toBeGreaterThan(0);

      // Check metadata in registry (either directly or via progression slug)
      const meta =
        EXERCISE_ANIMATION_REGISTRY[skill] ||
        EXERCISE_ANIMATION_REGISTRY[`${skill}-progression`] ||
        EXERCISE_ANIMATION_REGISTRY[`wall-${skill}-hold`];

      expect(meta).toBeDefined();
      expect(meta.isSkill).toBe(true);
      expect(meta.progressionStage).toBeDefined();
      expect(meta.progressionStage!.length).toBeGreaterThan(5);
    });
  });

  test('static hold exercises are properly flagged with isHold and breathing tempo', () => {
    const holds = ['prone-cobra', 'dead-hang', 'reverse-plank-bridge', 'forearm-plank', 'side-plank', 'hollow-body-hold', 'wall-handstand-hold', 'l-sit-progression'];

    holds.forEach((slug) => {
      const meta = EXERCISE_ANIMATION_REGISTRY[slug];
      expect(meta).toBeDefined();
      expect(meta.isHold).toBe(true);
      expect(meta.loopConfig.tempo.toLowerCase()).toContain('hold');
    });
  });

  test('fallback helper gracefully handles unindexed exercises with safe default metadata', () => {
    const unindexed = getExerciseAnimationMeta('unknown-custom-movement');
    expect(unindexed).toBeDefined();
    expect(unindexed.name).toBe('Unknown Custom Movement');
    expect(unindexed.verificationStatus).toBe('awaiting_motion_asset');
    expect(unindexed.diagramPattern).toBe('generic');
    expect(unindexed.instructionalCues.length).toBeGreaterThan(0);

    const fallbackSource = getExerciseAnimationSource('unknown-custom-movement');
    expect(fallbackSource).toBeDefined();
  });

  test('honest coverage report matches 100% verified animated demonstration coverage', () => {
    const report = getAnimationCoverageReport();

    expect(report.totalPublishedExercises).toBe(31);
    expect(report.accurateAnimatedExercises).toBe(31);
    expect(report.staticIllustrations).toBe(0);
    expect(report.missingAnimations).toBe(0);
    expect(report.animatedSkillDemonstrations).toBe(8);
    expect(report.staticSkillDemonstrations).toBe(0);
    expect(report.coveragePercentage).toBe(100);
  });
});
