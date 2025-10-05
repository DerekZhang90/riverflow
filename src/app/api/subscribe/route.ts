import { NextResponse } from 'next/server';
import { getDb } from '@/backend/config/db';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // 验证邮箱格式
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: '请输入有效的邮箱地址' },
        { status: 400 }
      );
    }

    const db = getDb();

    // 保存邮箱到数据库（使用 ON CONFLICT 避免重复订阅）
    await db.query(
      `INSERT INTO email_subscribers (email, created_at)
       VALUES ($1, NOW())
       ON CONFLICT (email) DO NOTHING`,
      [email.toLowerCase().trim()]
    );

    return NextResponse.json({
      success: true,
      message: '订阅成功！'
    });

  } catch (error) {
    console.error('Subscribe error:', error);
    return NextResponse.json(
      { error: '订阅失败，请稍后再试' },
      { status: 500 }
    );
  }
}
