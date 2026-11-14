declare const __dirname: string;
declare function require(name: string): any;
const fs = require('fs');
const path = require('path');

import { AuthService } from '@/features/auth/services/authService';
import { supabase } from '@/services/supabase/client';

jest.mock('@/services/supabase/client', () => ({
  supabase: {
    functions: {
      invoke: jest.fn(),
    },
    auth: {
      signOut: jest.fn().mockResolvedValue({ error: null }),
      getSession: jest.fn(),
    },
    from: jest.fn(),
  },
}));

describe('Phase 8.4 — Secure Account Deletion Workflow', () => {
  let authService: AuthService;

  beforeEach(() => {
    jest.clearAllMocks();
    authService = new AuthService();
  });

  test('deleteAccount invokes trusted server-side delete-account edge function and signs out', async () => {
    (supabase.functions.invoke as jest.Mock).mockResolvedValue({
      data: { success: true, message: 'Account deleted' },
      error: null,
    });

    await authService.deleteAccount();

    expect(supabase.functions.invoke).toHaveBeenCalledWith('delete-account', {
      method: 'POST',
    });
    expect(supabase.auth.signOut).toHaveBeenCalled();
  });

  test('deleteAccount still signs out locally if server deletion reports failure', async () => {
    (supabase.functions.invoke as jest.Mock).mockResolvedValue({
      data: null,
      error: { message: 'Edge function network error' },
    });

    await expect(authService.deleteAccount()).rejects.toThrow('Edge function network error');
    // Security invariant: local session must be invalidated regardless
    expect(supabase.auth.signOut).toHaveBeenCalled();
  });

  test('verifies delete-account edge function file exists and enforces service-role authorization', () => {
    const fnPath = path.resolve(__dirname, '../../supabase/functions/delete-account/index.ts');
    expect(fs.existsSync(fnPath)).toBe(true);

    const content = fs.readFileSync(fnPath, 'utf8');
    expect(content).toContain("Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')");
    expect(content).toContain('auth.admin.deleteUser(user.id)');
    expect(content).toContain('Authorization');
    expect(content).not.toContain('placeholder-key');
  });
});
